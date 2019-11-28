import { actionT } from "./ioActions";
import { Call } from "../features/call/types";
import { initialState as initialCallState } from '../features/call/CallAlgebraImplementation';

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

