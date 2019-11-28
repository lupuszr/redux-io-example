import { callAlgebraImplementation, initialState } from './CallAlgebraImplementation';
import { IO } from "funfix"
import { actionT } from './actions';
import { Call } from './types';

export default function ioCallReducer(state: IO<Call> = IO.of(() => initialState), action: actionT): IO<Call> {
  switch(action.type) {
    case 'init': {
      return IO.of(() => initialState);
    }
    case 'startACall': {
      return callAlgebraImplementation.startACall(action.payload.customer); // old state does not mater
    }
    case 'cancelCall': {
      return state.chain(call => callAlgebraImplementation.cancelCall(call));
    }
    case 'endCall': {
      return state.chain(call => callAlgebraImplementation.endCall(call))
          .chain(([call, balance]) => {
            console.log("call ended with balance:", balance);
            return IO.of(() => call)
          })
          .recover(err => { console.log('Error::', err); return initialState})
          .chain(initialState => IO.of(() => initialState))
    }
    default: 
      return state;
  }
}