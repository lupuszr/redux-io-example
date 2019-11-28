import { Option, None, Cancelable, Future, Success, IO, Duration, TestScheduler, GlobalScheduler, ExecutionModel, Try, ICancelable, Some, Failure } from "funfix"
import { PropertyObject } from '../typeHelpers';

export default class CustomerCallAlgebra<Customer, Interpreter, Call extends { length: number }, Balance> {
  constructor(
    public customerBackgroundCheck: (c: Customer) => IO<boolean>,
    public askForInterpreter: (c: Customer) => IO<Interpreter>,
    public updateCallInfo: (c: Call) => IO<Call>,
    public establishCall: (c: Customer, i: Interpreter) => IO<Call>,
    public callInProgress: (c: Call) => boolean,
    public endCall: (call: Call) => IO<[Call, Balance]>,
    public cancelCall: (call: Call) => IO<Call>,
    // public rateInterpreter: (call: Call, rate: number) => IO<Maybe<[Call, Interpreter]>>,
    // public debit: (c: Customer) => IO<Balance>,
    // public balance: (c: Customer) => IO<Balance>
    // missing
    // public reconnectCall: (c: Customer, i: Interpreter, room_id: string): IO<Call>
  ){}

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

  // cancelableCallInProgress(call: Call): IO<Call> {
  //   return IO.async((scheduler, callback) => {
  //     return scheduler.scheduleWithFixedDelay(Duration.seconds(0), Duration.seconds(3), () => {
  //       console.log("c::", call)
  //       return callback(Success({...call, length: call.length + 1}));
  //     });

  //     // return Cancelable.of(() => {
  //     //   console.info("Cancelling!")
  //     //   task.cancel()
  //     // })
  //   })
  // }

  copy(match: Partial<PropertyObject<typeof CustomerCallAlgebra>>): CustomerCallAlgebra<Customer, Interpreter, Call, Balance> {
    return {...this, ...match}
  }
}
