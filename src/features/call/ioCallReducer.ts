import { callAlgebraImplementation, initialState } from './CallAlgebraImplementation';
import { IO } from "funfix"
import { actionT } from './actions';
import { Call } from './types';

const fst = <A, B>(a: [A, B]): A => a[0];
const snd = <A, B>(a: [A, B]): B => a[1];
const lift = <T>(c: T) => IO.of(() => c);

export default function ioCallReducer(state: [IO<Call>, Call] = [IO.of(() => initialState), initialState], action: actionT): [IO<Call>, Call] {
  switch(action.type) {
    case 'init': {
      return [
        lift(initialState), 
        initialState
      ];
    }
    case 'startACall': {
      return [
        callAlgebraImplementation.startACall(action.payload.customer),
        snd(state)
      ]; // old state does not matter
    }
    case 'startACallSuccess': {
      return [state[0], action.payload]
    }
    case 'startACallError': {
      return [state[0], action.payload]
    }
    case 'cancelCall': {
      return [
        lift(snd(state)).chain(call => callAlgebraImplementation.cancelCall(call)), 
        snd(state)
      ];
    }
    case 'cancelCallSuccess': {
      return [fst(state), action.payload];
    }
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
