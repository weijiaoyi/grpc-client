import { ADD_PROTO } from '../actions/grpc';

const defaultState = {
  protos: []
}

export default (state = defaultState, action) => {
  switch(action.type){

      case ADD_PROTO:
      return {
          ...state,
          ...action.payload
      }

      default:
          break; 
  }
  return state
}