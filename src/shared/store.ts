import { applyMiddleware, combineReducers, createStore } from 'redux';
import reducers, { reduxStateT } from './reducers';
import ioMiddleware from './ioMiddleware';

const rootReducer = combineReducers<reduxStateT>(reducers);

export default createStore(rootReducer, applyMiddleware(ioMiddleware));
