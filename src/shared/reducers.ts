import callReducer from '../features/call/ioCallReducer';
import { Call } from '../features/call/types';
import ioReducer, { stateT } from './ioReducer';
import { IO } from 'funfix';

export type ioReducerT = stateT;

export type reduxStateT = {
  ioCall: IO<Call>;
  ioReducer: ioReducerT;
};

export const reducers = {
  ioCall: callReducer,
  ioReducer
}

export default reducers;