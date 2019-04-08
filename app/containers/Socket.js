import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TableGrid from '../components/TableGrid';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ItemList from '../components/ListItem';
import Card from '../components/Card';
import * as SocketActions from '../actions/socket';
import CodeMirror from 'codemirror';
import classNames from 'classnames';

import style from '../styles/style.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/json-lint.js';
import jsonLint from 'jsonlint';
import { connect as ioConnect } from 'socket.io-client';
import { ISocketState, ISocket, ISocketConnectionState } from '../reducers/socketReducer';
import { syntaxHighlight } from '../helpers/formatter';

function getSocketStateColor(state: ISocketConnectionState): string {
  switch(state) {
    case '-': return 'grey';
    case 'connecting': return 'white';
    case 'connected': return 'lightgreen';
    case 'disconnected': return 'coral';
    case 'connect_error': return 'red';
    case 'connect_timed_out': return 'orange';
    default: return 'white';
  }
}

class Socket extends PureComponent<ISocketState & typeof SocketActions> {

  componentDidMount() {
    window.jsonlint = jsonLint;
  }

  getEditor = (id: string, emitterId: string, requestValue: any) => {
    const { sockets } = this.props;
    let thisEmitter = sockets[id].emitters[emitterId];

    let textarea = document.createElement('textarea');
    let textareaWrapper = document.createElement('div');
    textareaWrapper.style.height = '100%';
  
    textareaWrapper.appendChild(textarea);
  
    let editorInst = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: 'application/json',
      // theme: 'monokai',
      indentUnit: 2,
      readOnly: (thisEmitter.isEmitting) ? true : false,
      indentWithTabs: true,
      autoCloseBrackets: true,
      tabSize: 2,
      autoRefresh: true,
      gutters: ["CodeMirror-lint-markers"],
      lint: true,
      lineWrapping: true
    });
      
    editorInst.setSize('100%', '100%');
    editorInst.setValue(requestValue || '');
    editorInst.on('change', (e) => this.onEmitterPropertyChanged(id, emitterId, 'request', e.getValue()));
  
    return editorInst;
  }

  onSocketPropertyChanged(id: string, property: string, value: any) {
    const { sockets } = this.props;
    let thisSocket = sockets[id];
    thisSocket[property] = value || 0;
    this.props.onUpdateSocket(id, thisSocket);
  }

  onEmitterPropertyChanged(id: string, emitterId: string, property: string, value: any) {
    const { sockets } = this.props;
    let thisSocket = sockets[id];
    let thisEmitter = thisSocket.emitters[emitterId];
    thisEmitter[property] = value;
    this.props.onUpdateEmitter(id, emitterId, thisEmitter);
  }

  connectSocket = (id) => {
    const { sockets } = this.props;
    let thisSocket = sockets[id];
    
    // Register preserved event that reactable to our state.
    if (!thisSocket.socket) {
      let io = ioConnect(thisSocket.endpointUrl, { 
        path: '/socket/message-hub/socket.io',
        reconnection: false
      });
      
      io.on('connect', () => {
        this.onSocketPropertyChanged(id, 'currentState', 'connected');
      });
  
      let timeOutRef;
      io.on('disconnect', (reason) => {
        clearTimeout(timeOutRef);
        timeOutRef = setTimeout(() => this.disconnectSocket(id), 5000);
      });
  
      io.on('connect_error', (error) => {
        this.onSocketPropertyChanged(id, 'currentState', 'connect_error');
      });
  
      io.on('connect_timeout', (timeout) => {
        this.onSocketPropertyChanged(id, 'currentState', 'connect_timeout');
      });
  
      this.onSocketPropertyChanged(id, 'socket', io);
      this.onSocketPropertyChanged(id, 'currentState', 'connecting');
    }
  }

  disconnectSocket = (id) => {
    const { sockets } = this.props;
    let thisSocket = sockets[id];
    let socket = thisSocket.socket;

    // Remove auto emit enabled emitter.
    Object.keys(thisSocket.emitters).forEach((emitterId) => {
      let thisEmitter = thisSocket.emitters[emitterId];
      if (!!thisEmitter.isOnAutoEmit) {
        clearTimeout(thisEmitter.emitIntervalRef);
        this.onEmitterPropertyChanged(id, emitterId, 'isOnAutoEmit', false);
      }
      this.onEmitterPropertyChanged(id, emitterId, 'isEmitting', false);
    });

    socket.close();
    socket.off('connect');
    socket.off('connect_error');
    socket.off('connect_timeout');
    socket.off('disconnect');
    socket = null;

    this.onSocketPropertyChanged(id, 'socket', socket);
    this.onSocketPropertyChanged(id, 'currentState', 'disconnected');
  }

  onEmit = (id, emitterId, thisSocket, thisEmitter) => {
    
    let parsedRequest;
    let socket: SocketIOClient.Socket = thisSocket.socket;

    if (!socket && !socket.disconnected) {
      console.warn('Socket must be connected first before emit or listen to event.');
      return;
    }

    try {
      parsedRequest= JSON.parse(thisEmitter.request)
    }
    catch (err) {
      console.warn('Request is not a valid json object.');
      return;
    }

    socket.emit(thisEmitter.eventName, parsedRequest, (ack) => {
      console.log(ack);
    });
  
    this.onEmitterPropertyChanged(id, emitterId, 'requestedDetail', syntaxHighlight({
      id: socket.id,
      dateTimeEmitted: new Date().toLocaleString(),
      uri: socket.io.uri,
      opts: socket.io.opts,
      engine: {
        writeBuffer: socket.io.engine.writeBuffer,
        transport_sendXhr: socket.io.engine.transport.sendXhr
      }
    }));
    this.onEmitterPropertyChanged(id, emitterId, 'isEmitting', true);
  }

  onEmitEvent = (id: string, emitterId: string) => {
    const { sockets } = this.props;
    let thisSocket = sockets[id];
    let thisEmitter = thisSocket.emitters[emitterId];

    if (!!thisEmitter.autoEmitIntervalMs) {

      let timeOut = setInterval(() => this.onEmit(id, emitterId, thisSocket, thisEmitter), thisEmitter.autoEmitIntervalMs);
      this.onEmitterPropertyChanged(id, emitterId, 'emitIntervalRef', timeOut);
      this.onEmitterPropertyChanged(id, emitterId, 'isOnAutoEmit', true);
    }
    else
    {
      this.onEmit(id, emitterId, thisSocket, thisEmitter);
      this.onEmitterPropertyChanged(id, emitterId, 'isEmitting', false);
    }
  }

  render() {

    // state
    const { sockets, currentTabIndex } = this.props;

    // actions
    const { onTabSwitch, onAddSocket, onRemoveSocket, onAddEmitter, onRemoveEmitter, onEndPointChanged, onServicePathChanged } = this.props;

    return (
      <div>
        {sockets && Object.keys(sockets).map(id => {
          let thisSocket = sockets[id];
          let socket = thisSocket.socket;
          let isConnected = thisSocket.currentState === 'connected';
          return (
            <Card key={id}>
              <button
                style={{float: 'right'}}
                className={classNames(style.button, style.danger)}
                onClick={(e) => onRemoveSocket(id)}
              >
                X
              </button>
              <h3>Configure Emitter</h3>
              <hr/>
              <table className={style.mat2}>
                <tbody>
                  <tr>
                    <td>
                      <strong>Endpoint</strong>
                    </td>
                    <td>
                      <input type='text' onChange={(e) => this.onSocketPropertyChanged(id, 'endpointUrl', e.target.value)} defaultValue={thisSocket.endpointUrl} className={classNames(style['full-width'], style['short'])}/>
                      <br/><small>Required</small>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Connection state</strong>
                    </td>
                    <td>
                    <button 
                      className={style.button}
                      onClick={(isConnected) ? () => this.disconnectSocket(id) : () => this.connectSocket(id)}
                    >
                      {(isConnected) ? 'Disconnect' : 'Connect'}</button> <span><strong 
                        style={{
                        color: getSocketStateColor(thisSocket.currentState)
                      }}>
                        {thisSocket.currentState}
                      </strong>
                    </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr/>
              <Row>
                <Col md={6}>
                  <p>Emitters</p>
                  {thisSocket.emitters && Object.keys(thisSocket.emitters).map((emitterId) => {
                    let thisEmitter = thisSocket.emitters[emitterId];
                    return (
                    <div style={{border: '2px solid #111', padding: '4px 8px', marginBottom: 8}} key={emitterId}>
                      <table className={style.mat2}>
                        <tbody>
                          <tr>
                            <td>
                              <strong>Auto emit interval</strong>
                            </td>
                            <td>
                            <input 
                              type='number'
                              className={classNames(style['short'])}
                              placeholder={'Emit once'} 
                              onChange={(e) => this.onEmitterPropertyChanged(id, emitterId, 'autoEmitIntervalMs', parseInt(e.target.value || 0))} defaultValue={thisEmitter.autoEmitIntervalMs}/> ms
                              <br/><small>Optional, leave blank to emit once at a time.</small>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Event Name</strong>
                            </td>
                            <td>
                              <input type='text' onChange={(e) => this.onEmitterPropertyChanged(id, emitterId, 'eventName', e.target.value)} defaultValue={thisEmitter.eventName} className={classNames(style['short'])} />
                              <br/><small>Required. Event name to listen.</small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Row>
                        <Col md={12}>
                          <p>Request</p>
                          <div style={{
                            overflowY: 'auto',
                            width: '100%', 
                            height: 100,
                            fontSize: 12
                          }} ref={nodeElm => nodeElm && nodeElm.children.length < 1 && nodeElm.appendChild(this.getEditor(id, emitterId, thisEmitter.request).getWrapperElement())}/>
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col md={12}>
                          <p>Last emitted request detail</p>
                          <pre style={{
                            overflowY: 'auto', 
                            width: '100%', 
                            height: 100, 
                            backgroundColor: '#111', 
                            margin: 0, 
                            padding: 10,
                            boxSizing: 'border-box'
                          }}>
                            {thisEmitter.requestedDetail}
                          </pre>
                        </Col>
                      </Row>
                      <br/>
                      <Row>
                        <Col md={12}>
                          <div style={{display: 'inline-block'}} className={style['buttons']}>
                            <button
                              disabled={!isConnected}
                              title={(!isConnected) && 'Socket is not established yet. Please click \'connect\' in configure section.'}
                              onClick={(e) => (thisEmitter.isOnAutoEmit) ? this.removeAutoEmit(id, emitterId) : this.onEmitEvent(id, emitterId) } 
                              className={style['button']}>
                              {(thisEmitter.isOnAutoEmit)
                              ?
                                'Stop Emit'
                              :
                                (!!thisEmitter.autoEmitIntervalMs)
                                ?
                                `Start auto emit (${thisEmitter.autoEmitIntervalMs}ms)`
                                :
                                'Emit'
                              }
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    )
                  })}
                  <button 
                    onClick={() => onAddEmitter(id)}
                    className={style['button']}
                  >
                  + Add new emitter
                  </button>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col md={12}>
                      <p>Listener</p>
                      <button 
                        // onClick={onAddListener} 
                        className={style['button']}
                      >
                      + Add new listener
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          )
        })}
        <button 
          onClick={onAddSocket} 
          className={style['button']}
        >
        + Add new socket
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.socket
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
  {
    ...SocketActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Socket);