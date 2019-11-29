# Domain driven design with react redux app in typescript

### This POC has multiple goals:
1. Be able to define an algebra which will describe a subdomain of our business logic.
2. Provide a definition for the algebra.
3. Connect the algebra to a react redux application.

## 1. Defining the algebra
We are starting by defining a class which should describe our problem. 
In our example we want to define a call service:

```typescript
class CallAlgebra {}
```

Next we can meditate about the flow of our business logic. In the example we imagining a scenario 
where a customer wish to ask for some help from an agent. So our flow should look something like this:
customerBackgroundCheck -> askForAgent -> establishCall -> endCall
                                       -> cancelCall

From the flow we can identify most of the necessary pieces of information needed to define our algebra.
As we don't really care what are these pieces of information we can just define them as generic parameters.

```typescript
class CallAlgebra<Customer, Agent, Call> {
}
```

Now we can try to define our collection of atomic functions which the developer should be able to connect together:

```typescript
class CallAlgebra<Customer, Agent, Call> {
  constructor(
    public customerBackgroundCheck: (c: Customer) => IO<boolean>,
    public askForInterpreter: (c: Customer) => IO<Agent>,
    public establishCall: (c: Customer, a: Agent) => IO<Call>,
    public endCall: (call: Call) => IO<Call>,
    public cancelCall: (call: Call) => IO<Call>
  )
}
```

As you see we are keeping our algebra pure and monadic, so we are able to chain our methods to build larger and more complex logic. For this example we are using funfix/effects but any IO implementation that support sync and async execution should work.

```typescript
class CallAlgebra<Customer, Agent, Call> {
...
  startACall(customer: Customer): IO<Call> {
    return this.customerBackgroundCheck(customer)
      .chain(
        (isOk) => {
          switch(isOk) {
            case true: return this.askForInterpreter(customer);
            case false: return IO.raise(Error("User didn't pass the background check")) 
          }
        }
      )
      .chain(interpreter => this.establishCall(customer, interpreter))
    }
  }
}
```

Now we have every piece to build our algebra, try play with this idea a bit and then we can move to the next step.

## 2. Provide a definition for the algebra

Now that we have an algebra we are ready to create an implementation for it (in FP word its called interpreter)

It is made of 2 sub steps. First we need to define our types for our algebras params and then we need to pass our methods implementation:

```typescript
export type Balance = {
  amount: number
}

export type Customer = {
  id: string,
  given_name: string,
  family_name: string,
  balance: Balance
}

export type Interpreter = {
  name: string
}

export type Call = {
  status: 'cancelled' | 'in_progress' | 'not_started' | 'ended' | 'reconnecting',
  room_id: Option<string>,
  length: number,
  interpreter: Option<Interpreter>,
  customer: Option<Customer>
}
```

```typescript
const callAlgebraImplementation = new CallAlgebra<Customer, Agent, Call>(
  // background check
  (c: Customer) => fetchIO<Customer>(`http://localhost:3000/customer/${c.id}`, {}).chain(a => IO.of(() => a.balance.amount >= 0)),
  // ask for interpreter
  () => fetchIO<Agent>('http://localhost:3000/interpreter/1', {}),
  // updateCallInfo
  (call: Call) => IO.of(() => call),
  // establish call
  (c: Customer, i: Interpreter) => {
    const data: Call = { status: 'in_progress', interpreter: validateInterpreter(i), customer: validateCustomer(c), length: 0, room_id: Some("20")};
    return fetchIO<Call>('http://localhost:3000/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).map(() => data)
  },
  // callInProgress
  (call: Call) => call.status === 'in_progress',
  // end call
  (call: Call) => IO.async((sch, cb) => {
      return sch.scheduleOnce(Duration.seconds(1), () => {
        const customerBalance = call.customer.fold(
          () => ({ amount: 0 }),
          customer => customer.balance
        );

        if (call.status === 'in_progress') {
          return cb(Try.of<Call>(() => {...call, status: 'ended'}))
        } else {
          return cb(Failure('Call is not in progress'))
        }
      })
    }),
  // cancel call
  (call: Call) => {
    if (call.status === 'in_progress') {
      const data: Call = {...call, status: 'cancelled'};
      return fetchIO<Call>(`http://localhost:3000/calls/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).map(() => data)
    } else {
      return IO.of(() => call)
    }
  },
)
```

## 3. Connect the algebra to a react redux application.
Because the IO monad is lazy and referentially transparent we can store its state in redux.
To make this work we need 2 reducers. One for the IO and the other one for the result of the IO.

```typescript
export default function ioCallReducer(state: IO<Call> = IO.of(() => initialState), action: actionT): IO<Call> {
  switch(action.type) {
    case 'init': {
      return IO.of(() => initialState);
    }
    case 'startACall': {
      return callAlgebraImplementation.startACall(action.payload.customer); // old state does not mater here
    }
    case 'cancelCall': {
      return state.chain(call => callAlgebraImplementation.cancelCall(call));
    }
    ...
    default: 
      return state;
  }
}
```

As you see the reducer name starts with `io` this is a must because with this we can detect which reducers 
should are IO monads. Also it is important to mention that its actions should have a field target:

```typescript
export const startACall: startACallT = customer => {
  return {
    type: 'startACall', 
    payload: { customer },
    target: '@ioCall'
  };
};
```
The target value is @ + the reducer name in state

In the other reducer (called ioReducer) our state is a product of the resulting computations

```typescript
export type stateT = {
  call: Call
}

const initialState = {
  call: initialCallState
}

export default function reducer(state: stateT = initialState, action: actionT): stateT {
  switch (action.type) {
    case 'init': {
      return initialState
    }
    case 'compute@ioCall': {
      return {
        ...state,
        call: action.payload
      }
    }
    // TO add some new:
    // case 'compute@ioUser': {
    //   return {
    //     ...state,
    //     user: action.payload
    //   }
    // }
    default: 
      return state;
  }
}  

```


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

* `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

* `yarn mock-server`

Starts a mock server

* `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

* `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
