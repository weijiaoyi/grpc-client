// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import grpcReducer from './grpcReducer';

const rootReducer = combineReducers({
  router,
  form,
  grpcReducer
});

export default rootReducer;
