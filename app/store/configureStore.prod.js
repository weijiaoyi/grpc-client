// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import type { counterStateType } from '../reducers/counter';

const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState?: counterStateType) {

  // const persistedState = loadState();

  // let store = createStore(rootReducer, initialState, enhancer, persistedState);

  // // Subscribe to localStorage
  // store.subscribe(() => {
  //   saveState({
  //     spinner: store.getState().spinner,
  //     grpc: store.getState().grpcReducer,
  //     router: store.getState().router,
  //     form: store.getState().form
  //   });
  // });
  // return store;

  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
