
export const ADD_PROTO = 'ADD_PROTO';
export const REMOVE_PROTO = 'REMOVE_PROTO';
export const TOGGLE_PROTO = 'TOGGLE_PROTO';
export const SELECT_SERVICE = 'SELECT_SERVICE';
export const GET_STORED_PROTOS = 'GET_STORED_PROTOS';
export const ADD_SERVICE = 'ADD_SERVICE';
export const POPULATE_FIELDS = 'POPULATE_FIELDS';
export const CLEAR_FIELDS = 'CLEAR_FIELDS';
export const CLEAR_SERVICES = 'CLEAR_SERVICES';
export const PRINT_RESPONSE_MESSAGE = 'PRINT_RESPONSE_MESSAGE';
export const CLEAR_RESPONSE_MESSAGE = 'CLEAR_RESPONSE_MESSAGE';
export const UPDATE_METADATA = 'UPDATE_METADATA';

export interface ProtoFile{
  name: string,
  path: string,
  isSelected?: boolean
}

export interface ServiceDef{
  name: string,
  path: string,
  requestType?: {},
  responseType?: {},
  isSelected?: boolean,
  serviceClient: () => {},
}

export interface MetaData{
  key: string,
  value: string
}

export function AddProto(proto: ProtoFile) {
  return {
    type: ADD_PROTO,
    payload: proto
  };
}

export function UpdateMetadata(metaData: MetaData[]) {
  return {
    type: UPDATE_METADATA,
    payload: metaData
  };
}

export function RemoveProto(proto: ProtoFile) {
  return {
    type: REMOVE_PROTO,
    payload: proto
  };
}

export function ClearServices(){
  return {
    type: CLEAR_SERVICES
  }
}

export function ToggleProto(proto: ProtoFile){

  const clearServiceIfUnselected = (dispatch) => new Promise(resolve => {
    if(proto.isSelected){
      dispatch({ type: CLEAR_SERVICES });
    }
    resolve();
  });

  return (dispatch) => {
    clearServiceIfUnselected(dispatch).then(() => {
      dispatch({
        type: TOGGLE_PROTO, 
        payload: {
          ...proto,
          isSelected: !proto.isSelected
        }
      });
    });
  }
}

export function SelectService(serviceDef: ServiceDef) {
  
  // const clearService = (dispatch) => new Promise(resolve => {
  //   dispatch({ type: CLEAR_SERVICES });
  //   resolve();
  // });

  // Find fields
  var fieldsInfo = serviceDef.requestType.children.map((child) => {
    return {
      fieldName: child.name,
      required: child.required,
      repeated: child.repeated,
      type: child.type.name,
      defaultValue: child.type.defaultValue
    }
  });

  return (dispatch) => {
    dispatch({type: SELECT_SERVICE, payload: serviceDef});
    dispatch({type: POPULATE_FIELDS, payload: fieldsInfo})
  }
}

export function PrintMessage(msg: string){
  return {
    type: PRINT_RESPONSE_MESSAGE,
    payload: msg
  }
}

export function ClearFields() {
  return {
    type: CLEAR_FIELDS
  };
}

export function ClearResponseMessage(){
  return {
    type: CLEAR_RESPONSE_MESSAGE
  };
}

export function AddService(serviceDef: ServiceDef) {
  return {
    type: ADD_SERVICE,
    payload: serviceDef
  };
}

export function GetStoredProtos() {

  return {
    type: GET_STORED_PROTOS,
  }
}