import { Option, None, Future, IO, Duration, Try, Some, Failure } from "funfix"
import { Balance, Customer, Interpreter, Call} from './types';
import CustomerCallAlgebra from '../../algebras/CallAlgebra';


const fetchFuture = <T>(url: string, config: {}) =>  Future.fromPromise(fetch(url, config).then(res => res.json() as unknown as T));
const fetchIO = <T>(url: string, config: {}) => IO.fromFuture(fetchFuture<T>(url, config));

const validateCustomer = (c: Customer): Option<Customer> =>  {
  return Some(c)
}

const validateInterpreter = (i: Interpreter): Option<Interpreter> => {
  return Some(i);
}

export const callAlgebraImplementation = new CustomerCallAlgebra<Customer, Interpreter, Call, Balance>(
  // background check
  (c: Customer) => fetchIO<Customer>(`http://localhost:3000/customer/${c.id}`, {}).chain(a => IO.of(() => a.balance.amount >= 0)),
  // ask for interpreter
  () => fetchIO<Interpreter>('http://localhost:3000/interpreter/1', {}),
  // updateCallInfo
  (call: Call) => IO.of(() => call),
  // establish call
  (c: Customer, i: Interpreter) => {
    // const x = validateInterpreter(i)
    //   .chain(interpreter => validateCustomer(c).chain((customer) => Some<[Interpreter, Customer]>([interpreter, customer]))).fold(
    //     () => ({x: 0, y: 1}),
    //     ([i, c]) => ({x: 1, y: 2})
    //   )
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
          return cb(Try.of<[Call, Balance]>(() => [{...call, status: 'ended'}, customerBalance]))
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
  //rate interpreter
  // (call: Call, rate: number) => {
  //   return IO.of(() => [call, call.interpreter])
  // },  
)

export const initialState: Call = {
  status: "not_started",
  room_id: None,
  length: 0,
  interpreter: None,
  customer: None
};
