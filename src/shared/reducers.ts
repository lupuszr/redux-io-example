import callReducer from '../features/call/ioCallReducer';
import { Call } from '../features/call/types';
import { IO } from 'funfix';

export type reduxStateT = {
  ioCall: [IO<Call>, Call];
};

export const reducers = {
  ioCall: callReducer
}

export default reducers;