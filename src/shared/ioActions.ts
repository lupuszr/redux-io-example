import { Call } from "../features/call/types";

export type actionTypeT = 'init' | 'compute@ioCall'

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
};

export type actionT =
  | ack<'init', { }>
  | ack<'compute@ioCall', Call>
