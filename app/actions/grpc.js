
export const ADD_PROTO = 'ADD_PROTO';
export const GET_STORED_PROTOS = 'GET_STORED_PROTOS';

export interface IProtoFile{
  name: string,
  path: string,
}

export function AddProto(proto: IProtoFile) {
  return {
    type: ADD_PROTO,
    payload: proto
  };
}

export function GetStoredProtos() {

  return {
    type: GET_STORED_PROTOS,
  }
}