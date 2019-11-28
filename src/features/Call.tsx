import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { Call, callAlgebraImplementation, Customer, initialState } from '../implementations/CallAlgebraImplementation';
import { Option, None, Cancelable, Future, Success, IO, Duration, TestScheduler, GlobalScheduler, ExecutionModel, Try, ICancelable, Some, Failure } from "funfix"

type actionTypeT =
  | 'init'
  | 'start_a_call'
  | 'end_a_call'
  | 'cancel_call'

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
};

export type actionT =
  | ack<'init', { }>
  | ack<'start_a_call', { customer: Customer }>
  | ack<'end_a_call', { }>
  | ack<'cancel_call', { }>

export function ioReducer(state: Call, action: actionT): IO<Call> {
  switch(action.type) {
    case 'init': {
      return IO.of(() => state)
    }
    case 'start_a_call': {
      return callAlgebraImplementation.startACall(action.payload.customer);
    }
    case 'cancel_call': {
      return callAlgebraImplementation.cancelCall(state);
    }
    case 'end_a_call': {
      return callAlgebraImplementation.endCall(state)
          .chain(([call, balance]) => {
            console.log("call ended with balance:", balance);
            return IO.of(() => call)
          })
          .recover(err => { console.log('Error::', err); return initialState})
          .chain(initialState => IO.of(() => initialState))
    }
    default: 
      return IO.of(() => state);
  }
}


const customerMock = {id: "1", given_name: "Alexis", family_name: "Greek warior", balance: { amount: 10 }};

const CallComponent = () => {
  const [trigger, setTrigger] = useState<actionT>({type: 'init', payload: {}})
  const [callState, setCallState] = useState<() => Call>(() => () => initialState)
  useEffect(() => {
    console.log(trigger, JSON.stringify(callState()))
    ioReducer(callState(), trigger)
      .runOnComplete(res => {
        res.fold(
          error => console.log('error::', error),
          val => {
            if (JSON.stringify(callState()) !== JSON.stringify(val)) {
              setCallState(os => () => val)
            }
          })
      })
  }, [trigger])

  const { status, customer, interpreter } = callState();
  // console.log("callState is::", callState)
  return (
    <div>
      <button onClick={() => { setTrigger({type: 'start_a_call', payload: { customer: customerMock }})}}>make a call</button>
      <button onClick={() => { setTrigger({type: 'cancel_call', payload: { }}) }}>cancell call</button>
      <button onClick={() => { setTrigger({type: 'end_a_call', payload: { }}) }}>stop call</button>
      <h4>
        Call status: {status}
      </h4>
      <h4>customer: {customer.fold(() => 'N/A', JSON.stringify)}</h4>
      <h4>interpreter: {interpreter.fold(() => 'N/A', JSON.stringify)}</h4>
    </div>
  )
}

export default CallComponent;