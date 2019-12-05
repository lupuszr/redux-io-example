import { callAlgebraImplementation } from './CallAlgebraImplementation';
import { Customer, Call } from './types';

type actionTypeT = 'startACall' | 'startACallSuccess' | 'startACallError' | 'endCall' | 'cancelCall' | 'cancelCallSuccess' | 'cancelCallError' | 'init'

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
  target: '@ioCall' // needed for io middleware
};

export type actionT =
  | ack<'init', { }>
  | ack<'startACall', { customer: Customer }>
  | ack<'startACallSuccess', Call>
  | ack<'startACallError', Call>
  | ack<'endCall', { }>
  | ack<'cancelCall', {}>
  | ack<'cancelCallSuccess', Call>
  | ack<'cancelCallError', Call>


type startACallT = (c: Customer) => actionT;
export const startACall: startACallT = customer => {
  return {
    type: 'startACall', 
    payload: { customer },
    target: '@ioCall'
  };
};

type endCallT = () => actionT;
export const endCall: endCallT = () => {
  return {
    type: 'endCall', 
    payload: { },
    target: '@ioCall'
  };
};

type cancelCallT = () => actionT;
export const cancelCall: cancelCallT = () => {
  return {
    type: 'cancelCall', 
    payload: { },
    target: '@ioCall'
  };
};