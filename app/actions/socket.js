import { ISocketEmitter, ISocketListener } from '../reducers/socketReducer';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/display/autorefresh.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/mode/javascript/javascript.js';

export const Actions = {
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

const getUniqueInitialEmitterKey = () => Date.now().toString();
const getInitialSocketEmitter = () => {
  return {
    eventName: undefined,
    autoEmit: false,
    autoEmitIntervalMs: undefined,
    isEmitting: false,
    endpointUrl: 'https://api.dev.pgsoft.tech/smartbot',
    request: '{\n\t\n}',
    requestedDetail: undefined,
    currentState: 'idle'
  }
}

export function onAddEmitter(id: string, value: ISocketEmitter) {
  
  return {
    type: Actions.ON_ADD_EMITTER,
    payload: {
      id: getUniqueInitialEmitterKey(),
      value: getInitialSocketEmitter()
    }
  };
}

export function onUpdateEmitter(id: string, value: ISocketEmitter) {
  return {
    type: Actions.ON_UPDATE_EMITTER,
    payload: {
      id,
      value
    }
  };
}

export function onRemoveEmitter(id: string) {
  return {
    type: Actions.ON_REMOVE_EMITTER,
    payload: id
  };
}

export function onTabSwitch(index: string) {
  return {
    type: Actions.ON_TAB_SWITCHED,
    payload: index
  };
}

