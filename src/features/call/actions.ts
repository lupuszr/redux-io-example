import { callAlgebraImplementation } from './CallAlgebraImplementation';
import { Customer } from './types';

type actionTypeT = keyof typeof callAlgebraImplementation | 'init'

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
  target: '@ioCall' // needed for io middleware
};

export type actionT =
  | ack<'init', { }>
  | ack<'startACall', { customer: Customer }>
  | ack<'endCall', { }>
  | ack<'cancelCall', { }>


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