import { callAlgebraImplementation, initialState } from './CallAlgebraImplementation';
import { IO } from "funfix"
import { actionT } from './actions';
import { Call } from './types';

const fst = <A, B>(a: [A, B]): A => a[0];
const snd = <A, B>(a: [A, B]): B => a[1];
const lift = <T>(c: T) => IO.of(() => c);

export default function ioCallReducer(state: [IO<Call>, Call] = [IO.of(() => initialState), initialState], action: actionT): [IO<Call>, Call] {
  const update = (a: IO<Call>): [IO<Call>, Call] => {
    return [
      a,
      snd(state)
    ]
  }

  switch(action.type) {
    case 'init': {
      return [
        lift(initialState), 
        initialState
      ];
    }
    case 'startACall': {
      return update(
        callAlgebraImplementation.startACall(action.payload.customer) // old state does not matter
      )
    }
    case 'cancelCall': {
      return update(
        lift(snd(state)).chain(call => callAlgebraImplementation.cancelCall(call)) // we don't want to repeat the last effects but we care about its result
      );
    }
    case 'startACallSuccess':
    case 'startACallError':
    case 'cancelCallSuccess':
    case 'cancelCallError': {
      return [fst(state), action.payload];
    }
    // case 'endCall': {
    //   return state.chain(call => callAlgebraImplementation.endCall(call))
    //       .chain(([call, balance]) => {
    //         console.log("call ended with balance:", balance);
    //         return IO.of(() => call)
    //       })
    //       .recover(err => { console.log('Error::', err); return initialState})
    //       .chain(initialState => IO.of(() => initialState))
    // }
    default: 
      return state;
  }
}
