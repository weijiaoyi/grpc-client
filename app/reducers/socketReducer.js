import { Actions } from '../actions/socket';

export type ISocketConnectionState = 'idle' | 'connecting' | 'connected' | 'connect_error' | 'connect_timed_out' | 'disconnected';

export interface ISocketEmitter {
  [id: string]: {
    eventName : string,
    endpointUrl: string,
    servicePath: string,
    request: any,
    requestedDetail: any,
    isOnAutoEmit: boolean,
    autoEmitIntervalMs: number,
    isEmitting: boolean,
    currentState: ISocketConnectionState
  }
}

export interface ISocketListener {
  [id: string]: {
    eventName : string,
    response: object,
    isListening: boolean,
  }
}

export interface ISocketState {
  socketEmitters: ISocketEmitter,
  socketListeners: ISocketListener,
  currentTabIndex: number
}

const initialState: ISocketState = {
  socketEmitters: {},
  socketListeners: {},
  currentTabIndex: 0
}

export default (state: ISocketState = initialState, { type, payload }) => {
  switch (type) {

    case Actions.ON_ADD_EMITTER:
      return {
        ...state,
        socketEmitters: {...state.socketEmitters, ...{
          [payload.id]: payload.value
        }}
      }

    case Actions.ON_REMOVE_EMITTER: {
      let { [payload]: rmItem, ...rest } = state.socketEmitters;
      return {
        ...state,
        socketEmitters: rest
      }
    }

    case Actions.ON_UPDATE_EMITTER:
      state = {
        ...state,
        socketEmitters: {
          ...state.socketEmitters,
          [payload.id]: payload.value
        }
      }
      return state;

    case Actions.ON_ADD_LISTENER:
      return {
        ...state,
        socketListeners: {...state.socketListeners, payload}
      }

    case Actions.ON_REMOVE_LISTENER: {
      let { [payload]: rmItem, ...rest } = state;
      return {
        ...state,
        socketListeners: rest
      }
    }

    case Actions.ON_UPDATE_LISTENER:
      state.socketListeners[payload.eventName] = payload.value;
      return state;

    case Actions.ON_TAB_SWITCHED:
      state = {
        ...state,
        currentTabIndex: payload
      }
      return state;

    default:
      return state;
  }
}
