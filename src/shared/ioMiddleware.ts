import { Middleware } from 'redux';
import { reduxStateT } from './reducers';

const ioMiddleware: Middleware<{}, reduxStateT> = store => next => (action: {type: string, payload: {}, target: string}) => {
  const { dispatch, getState } = store;
  next(action); // we want to call the middleware after the reducers are ready
  
  if (action.target && action.target.indexOf("@io") === 0) {
    // find all reducers that starts with io except ioReducer
    type possibleIOReducers = Exclude<keyof reduxStateT, 'ioReducer'>;
    
    const target = action.target.slice(1) as possibleIOReducers;
    getState()[target].runOnComplete(
      res => {
        res.fold(
          error => console.log('error::', error),
          val => {
            console.log(val)
            dispatch({
              type: `compute@${target}`,
              payload: val 
            })
          })
      }
    )

    
  }
};

export default ioMiddleware;
