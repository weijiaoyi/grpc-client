import { ISocket, IEmitter, IListener } from '../reducers/socketReducer';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/display/autorefresh.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/mode/javascript/javascript.js';

export const Actions = {
  TOGGLE_SOCKET_CONNECTED: 'ON_CONNECT_SOCKET',
  ON_ADD_SOCKET: 'ON_ADD_SOCKET',
  ON_REMOVE_SOCKET: 'ON_REMOVE_SOCKET',
  ON_UPDATE_SOCKET: 'ON_UPDATE_SOCKET',
  ON_ADD_EMITTER: 'ON_ADD_EMITTER',
  ON_REMOVE_EMITTER: 'ON_REMOVE_EMITTER',
  ON_UPDATE_EMITTER: 'ON_UPDATE_EMITTER',
  ON_ADD_LISTENER: 'ON_ADD_LISTENER',
  ON_REMOVE_LISTENER: 'ON_REMOVE_LISTENER',
  ON_UPDATE_LISTENER: 'ON_UPDATE_LISTENER',
  ON_TAB_SWITCHED: 'ON_TAB_SWITCHED',
  ON_ENDPOINT_CHANGED: 'ON_ENDPOINT_CHANGED',
  ON_SERVICE_PATH_CHANGED: 'ON_SERVICE_PATH_CHANGED',
}

const getUniqueIdKey = () => Date.now().toString();
const getInitialSocket = () => {
  return {
    endpointUrl: 'https://api.dev.pgsoft.tech/smartbot',
    socket: undefined,
    emitters: {},
    listeners: {},
    currentState: '-'
  }
}
const getInitialEmitter = () => {
  return {
    eventName: undefined,
    request: '{\n\t\n}',
    requestedDetail: undefined,
    isOnAutoEmit: false,
    autoEmitIntervalMs: undefined,
    isEmitting: false
  }
}

const getInitialSocketListener = () => {
  return {
    eventName: undefined,
    isListening: true,
    response: undefined,
  }
}

/* Sockets */
export function onAddSocket() {
  return {
    type: Actions.ON_ADD_SOCKET,
    payload: {
      id: getUniqueIdKey(),
      value: getInitialSocket()
    }
  };
}
export function onUpdateSocket(id: string, value: ISocket) {
  return {
    type: Actions.ON_UPDATE_SOCKET,
    payload: {
      id,
      value
    }
  };
}
export function onRemoveSocket(id: string) {
  return {
    type: Actions.ON_REMOVE_SOCKET,
    payload: id
  };
}

/* Emitters */
export function onAddEmitter(id: string) {
  return {
    type: Actions.ON_ADD_EMITTER,
    payload: {
      id,
      emitterId: getUniqueIdKey(),
      value: getInitialEmitter()
    }
  };
}
export function onUpdateEmitter(id: string, emitterId: string, value: IEmitter) {
  return {
    type: Actions.ON_UPDATE_EMITTER,
    payload: {
      id,
      emitterId,
      value
    }
  };
}
export function onRemoveEmitter(id: string, emitterId: string) {
  return {
    type: Actions.ON_REMOVE_EMITTER,
    payload: {
      id,
      emitterId
    }
  };
}


export function onAddListener() {
  
  return {
    type: Actions.ON_ADD_LISTENER,
    payload: {
      id: getUniqueInitialListenerKey(),
      value: getInitialSocketListener()
    }
  };
}

export function onRemoveListener(id: string) {
  return {
    type: Actions.ON_REMOVE_LISTENER,
    payload: id
  };
}

export function onUpdateListener(id: string, value: ISocketListener) {
  return {
    type: Actions.ON_UPDATE_LISTENER,
    payload: {
      id,
      value
    }
  };
}

export function onTabSwitch(index: string) {
  return {
    type: Actions.ON_TAB_SWITCHED,
    payload: index
  };
}

