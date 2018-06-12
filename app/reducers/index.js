// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import grpcReducer from './grpcReducer';

const rootReducer = combineReducers({
  router,
  grpcReducer
});

export default rootReducer;
