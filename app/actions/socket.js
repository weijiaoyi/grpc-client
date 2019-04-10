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
  ON_UPDATE_MODAL: 'ON_UPDATE_MODAL',
  ON_TAB_SWITCHED: 'ON_TAB_SWITCHED',
  ON_ENDPOINT_CHANGED: 'ON_ENDPOINT_CHANGED',
  ON_SERVICE_PATH_CHANGED: 'ON_SERVICE_PATH_CHANGED',
}

const getUniqueIdKey = () => Date.now().toString();
const getInitialSocket = () => {
  return {
    endpointUrl: 'https://api.dev.pgsoft.tech/',
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
    isListening: false,
    response: undefined,
    responseList: []
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


export function onAddListener(id: string) {
  
  return {
    type: Actions.ON_ADD_LISTENER,
    payload: {
      id,
      listenerId: getUniqueIdKey(),
      value: getInitialSocketListener()
    }
  };
}

export function onUpdateListener(id: string, listenerId: string, value: ISocketListener) {
  return {
    type: Actions.ON_UPDATE_LISTENER,
    payload: {
      id,
      listenerId,
      value
    }
  };
}

export function onRemoveListener(id: string, listenerId: string) {
  return {
    type: Actions.ON_REMOVE_LISTENER,
    payload: {
      id,
      listenerId
    }
  };
}

export function onUpdateModal(modal: IModal) {
  return {
    type: Actions.ON_UPDATE_MODAL,
    payload: modal
  }
}

export function onTabSwitch(index: string) {
  return {
    type: Actions.ON_TAB_SWITCHED,
    payload: index
  };
}

