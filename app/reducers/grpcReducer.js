import { ADD_PROTO, GET_STORED_PROTOS, ADD_SERVICE } from '../actions/grpc';

const defaultState = {
  protos: [],
  services: [],
}

export default (state = defaultState, action) => {
  switch(action.type){

      case ADD_PROTO:

      let index = state.protos.findIndex(pt => pt.path == action.payload.path);
      if(index > -1) break; //todo: dispatch msg event saying that already exist

      return {
          ...state,
          protos: [...state.protos, action.payload]
      }

      case GET_STORED_PROTOS:
      break;

      case ADD_SERVICE:

      return{
        ...state,
        services: [...state.services, action.payload]
      }

      default:
          break; 
  }
  return state;
}