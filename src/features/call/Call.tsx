import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionT, startACall, cancelCall, endCall } from './actions';
import { reduxStateT, ioReducerT } from '../../shared/reducers';
import { Call } from './types';

const customerMock = {id: "1", given_name: "Alexis", family_name: "Greek warior", balance: { amount: 10 }};

const CallComponent = () => {
  const dispatch = useDispatch();
  const call = useSelector<reduxStateT, Call>(state => state.ioReducer.call);

  const { status, customer, interpreter } = call;
  // console.log("callState is::", callState)
  return (
    <div>
      <button onClick={() => { dispatch(startACall(customerMock))}}>make a call</button>
      <button onClick={() => { dispatch(cancelCall())}}>cancell call</button>
      <button onClick={() => { dispatch(endCall())}}>stop call</button>
      <h4>
        Call status: {status}
      </h4>
      <h4>customer: {customer.fold(() => 'N/A', JSON.stringify)}</h4>
      <h4>interpreter: {interpreter.fold(() => 'N/A', JSON.stringify)}</h4>
    </div>
  )
}

export default CallComponent;