import { Actions } from '../actions/socket';

export type ISocketConnectionState = '-' | 'connecting' | 'connected' | 'connect_error' | 'connect_timed_out' | 'disconnected';

export interface ISocket {
  [id: string]: {
    endpointUrl: string,
    socket: SocketIOClient.Socket,
    emitters: IEmitter,
    listeners: IListener,
    currentState: ISocketConnectionState,
  }
}

export interface IEmitter {
  [id: string]: {
    eventName : string,
    request: any,
    requestedDetail: any,
    emitIntervalRef: any,
    isOnAutoEmit: boolean,
    autoEmitIntervalMs: number,
    isEmitting: boolean,
  }
}

export interface IListener {
  [id: string]: {
    eventName : string,
    response: object,
    isListening: boolean,
  }
}

export interface ISocketState {
  sockets: ISocket,
  currentTabIndex: number,
}

const initialState: ISocketState = {
  sockets: {},
  currentTabIndex: 0,
  isSocketConnected: false
}

export default (state: ISocketState = initialState, { type, payload }) => {
  switch (type) {

    case Actions.TOGGLE_SOCKET_CONNECTED:
      return {
        ...state,
        isSocketConnected: payload.isSocketConnected
      }

    case Actions.ON_ADD_SOCKET:
      return {
        ...state,
        sockets: {...state.sockets, ...{
          [payload.id]: payload.value
        }}
      }

    case Actions.ON_UPDATE_SOCKET:
      state = {
        ...state,
        sockets: {
          ...state.sockets,
          [payload.id]: payload.value
        }
      }
      return state;

    case Actions.ON_REMOVE_SOCKET: {
      let { [payload]: rmItem, ...rest } = state.sockets;
      return {
        ...state,
        sockets: rest
      }
    }

    case Actions.ON_ADD_EMITTER:
      state = {
        ...state,
        sockets: {
          ...state.sockets,
          [payload.id]: {
            ...state.sockets[payload.id],
            emitters: {
              ...state.sockets[payload.id].emitters, ...{
                [payload.emitterId]: payload.value
              }
            }
          }
        }
      }
      return state;

    case Actions.ON_UPDATE_EMITTER:
    state = {
      ...state,
      sockets: {
        ...state.sockets, 
        [payload.id]: {
          ...state.sockets[payload.id],
          emitters: {
            ...state.sockets[payload.id].emitters, ...{
              [payload.emitterId]: payload.value
            }
          }
        }
      }
    }
    return state;

    case Actions.ON_REMOVE_EMITTER: {
      let { [payload.emitterId]: rmItem, ...rest } = state.sockets[payload.id];
      return {
        ...state,
        sockets: {
          ...state.sockets,
          rest
        }
      }
    }

    case Actions.ON_TAB_SWITCHED:
      return state = {
        ...state,
        currentTabIndex: payload
      }

    default:
      return state;
  }
}
