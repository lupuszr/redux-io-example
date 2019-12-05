import { Middleware } from 'redux';
import { reduxStateT } from './reducers';
import { ICancelable, IO } from 'funfix';

let cancelableIOExecution: ICancelable | undefined = undefined;

const ioMiddleware: Middleware<{}, reduxStateT> = store => next => (action: {type: string, payload: {}, target: string}) => {
  const { dispatch, getState } = store;
  next(action); // we want to call the middleware after the reducers are ready

  console.log("type::", action.type)
  if (action.type.includes('cancel')) {
    console.log('pina', cancelableIOExecution)
    cancelableIOExecution && cancelableIOExecution.cancel();
  }
  
  if (action.target && action.target.indexOf("@io") === 0) {
    // find all reducers that starts with io except ioReducer
    type possibleIOReducers = Exclude<keyof reduxStateT, 'somenoneioredducer'>;
    
    const target = action.target.slice(1) as possibleIOReducers;
    const io = getState()[target][0]
      .executeWithOptions({ autoCancelableRunLoops: true })
      .doOnCancel(IO.of(() => {
        console.log('trying to cancel')
      }));

    const c: ICancelable = io.runOnComplete(
      res => {
        res.fold(
          error => {
            console.log('error::', error)
            dispatch({
              type: action.type + 'Error',
              payload: error
            })
          },
          val => {
            console.log(val)
            dispatch({
              type: action.type + 'Success',
              payload: val
            })
          })
      }
    );
    cancelableIOExecution = c;    
  }
};

export default ioMiddleware;
