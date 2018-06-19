import { ADD_PROTO, CLEAR_RESPONSE_MESSAGE, PRINT_RESPONSE_MESSAGE, CLEAR_FIELDS, GET_STORED_PROTOS, ADD_SERVICE, SELECT_PROTO, POPULATE_FIELDS, SELECT_SERVICE, CLEAR_SERVICES } from '../actions/grpc';

const defaultState = {
  protos: [],
  services: [],
  fields: [],
  responseMessage: ''
}

export default (state = defaultState, action) => {
  switch(action.type){

      case CLEAR_SERVICES:
      return {
        ...state,
        services: defaultState.services,
      }

      case CLEAR_FIELDS:
      return {
        ...state,
        fields: defaultState.fields,
      }

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
      return {
        ...state,
        services: [...state.services, action.payload]
      }

      case SELECT_PROTO:
      return {
        ...state,
        protos: state.protos.map((proto) => {
          if(proto.name.indexOf(action.payload.name) > -1){
            proto.isSelected = true;
          }
          else proto.isSelected = false;
          return proto;
        })
      }

      case SELECT_SERVICE:
      return {
        ...state,
        services: state.services.map((service) => {
          if(service.name.indexOf(action.payload.name) > -1){
            service.isSelected = true;
          }
          else service.isSelected = false;
          return service;
        })
      }

      case POPULATE_FIELDS:
      return {
        ...state,
        fields: action.payload
      }

      case PRINT_RESPONSE_MESSAGE:
      return {
        ...state,
        responseMessage: action.payload
      }

      case CLEAR_RESPONSE_MESSAGE:
      return {
        ...state,
        responseMessage: defaultState.responseMessage
      }

      default:
          break; 
  }

  return state;
}