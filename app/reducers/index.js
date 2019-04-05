// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import grpcReducer from './grpcReducer';
import spinner from './spinnerReducer';
import socket from './socketReducer';

const rootReducer = combineReducers({
  router,
  form,
  grpcReducer,
  spinner,
  socket
});

export default rootReducer;
