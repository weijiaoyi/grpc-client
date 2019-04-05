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
import { ISocketState, ISocketConnectionState } from '../reducers/socketReducer';
import { syntaxHighlight } from '../helpers/formatter';

function getSocketStateColor(state: ISocketConnectionState): string {
  switch(state) {
    case 'idle': return 'grey';
    case 'connecting': return 'white';
    case 'connected': return 'lightgreen';
    case 'disconnected': return 'coral';
    case 'connect_error': return 'red';
    case 'connect_timed_out': return 'orange';
    default: return 'white';
  }
}

class Socket extends PureComponent<ISocketState & typeof SocketActions> {

  script = document.createElement("script");
  // ioConnect(options: object) :  {
  //   const { endPointUrl, servicePath } = this.props;
  //   return io.connect(endPointUrl + `/${servicePath}`, { 
  //     path: '/socket/message-hub/socket.io',
  //     ...options
  //   });
  // }

  stopEmitEvent = document.createEvent('Event');

  componentDidMount() {
    // Append socket script on load.
    window.jsonlint = jsonLint;
    this.stopEmitEvent.initEvent('stopEmit', true, true);
  }

  getEditor = (id: string, requestValue: any) => {
    const { socketEmitters } = this.props;
    let thisEmitter = socketEmitters[id];

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
    editorInst.on('change', (e) => this.onEmitterPropertyChanged(id, 'request', e.getValue()));
  
    return editorInst;
  }

  onEmitterPropertyChanged(id: string, property: string, value) {
    const { socketEmitters } = this.props;
    let thisEmitter = socketEmitters[id];
    thisEmitter[property] = value || 0;
    this.props.onUpdateEmitter(id, thisEmitter);
  }

  onEmit = (id, thisEmitter) => {
    let parsedRequest;
    try {
      parsedRequest= JSON.parse(thisEmitter.request)
    }
    catch (err) {
      console.warn('Request is not a valid json object.');
      return;
    }

    let io = ioConnect(thisEmitter.endpointUrl, { 
      path: '/socket/message-hub/socket.io'
    });

    this.onEmitterPropertyChanged(id, 'currentState', 'connecting');
    this.onEmitterPropertyChanged(id, 'isEmitting', true);

    io.on('connect', () => {
      this.onEmitterPropertyChanged(id, 'currentState', 'connected');

      io = io.emit(thisEmitter.eventName, parsedRequest);
      this.onEmitterPropertyChanged(id, 'requestedDetail', syntaxHighlight({
        id: io.id,
        dateTimeEmitted: new Date().toLocaleString(),
        uri: io.io.uri,
        opts: io.io.opts,
        engine: {
          writeBuffer: io.io.engine.writeBuffer,
          transport_sendXhr: io.io.engine.transport.sendXhr
        }
      }));
    });

    io.on('disconnect', (reason) => {
      this.onEmitterPropertyChanged(id, 'currentState', 'disconnected');
    });

    io.on('connect_error', (error) => {
      this.onEmitterPropertyChanged(id, 'currentState', 'connect_error');
    });

    io.on('connect_timeout', (timeout) => {
      this.onEmitterPropertyChanged(id, 'currentState', 'connect_error');
    });
  }

  removeAutoEmit = (e, id, timeOut) => {
    clearInterval(timeOut);
    e.target.removeEventListener('stopEmit', () => this.removeAutoEmit(timeOut));
    e.target.innerText = 'Emit';
    this.onEmitterPropertyChanged(id, 'isOnAutoEmit', false);
    this.onEmitterPropertyChanged(id, 'isEmitting', false);
  }

  onEmitEvent = (e: MouseEvent, id: string) => {

    const { socketEmitters } = this.props;
    let thisEmitter = socketEmitters[id];

    if (!!thisEmitter.autoEmitIntervalMs) {

      let timeOut = setInterval(() => this.onEmit(id, thisEmitter), thisEmitter.autoEmitIntervalMs);

      e.target.addEventListener('stopEmit', (e) => this.removeAutoEmit(e, id, timeOut));
      this.onEmitterPropertyChanged(id, 'isOnAutoEmit', true);
    }
    else
    {
      this.onEmit(id, thisEmitter);
      this.onEmitterPropertyChanged(id, 'isEmitting', false);
    }
  }

  render() {

    // state
    const { socketEmitters, currentTabIndex } = this.props;

    // actions
    const { onTabSwitch, onAddEmitter, onRemoveEmitter, onEndPointChanged, onServicePathChanged } = this.props;

    return (
      <div>
        <Tabs className={style['react-tabs']}
          selectedTabClassName={style['selected']}
          onSelect={onTabSwitch}
          selectedIndex={currentTabIndex}
          forceRenderTabPanel={true}
        >
          <TabList className={style['react-tab-list']}>
            <Tab className={style['react-tab']}>Emit</Tab>
            <Tab className={style['react-tab']}>Listen</Tab>
          </TabList>
          <TabPanel hidden={currentTabIndex == 1} className={style['react-tab-panel']}>
            <div className={style['container']}>
              {socketEmitters && Object.keys(socketEmitters).map(id => {
                let thisEmitter = socketEmitters[id];
                return (
                  <Card key={id}>
                    <button 
                      style={{float: 'right'}}
                      className={classNames(style.button, style.danger)}
                      onClick={(e) => onRemoveEmitter(id)}
                    >
                      X
                    </button>
                    <h3>Configuration</h3>
                    <hr/>
                    <table className={style.mat2}>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Endpoint</strong>
                          </td>
                          <td>
                            <input type='text' onChange={(e) => this.onEmitterPropertyChanged(id, 'endpointUrl', e.target.value)} defaultValue={thisEmitter.endpointUrl} className={classNames(style['full-width'], style['short'])}/>
                            <br/><small>Required</small>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Event Name</strong>
                          </td>
                          <td>
                            <input type='text' onChange={(e) => this.onEmitterPropertyChanged(id, 'eventName', e.target.value)} defaultValue={thisEmitter.eventName} className={classNames(style['short'])} />
                            <br/><small>Required. Event name to emit</small>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Auto emit interval</strong>
                          </td>
                          <td>
                            <input 
                              type='number'
                              className={classNames(style['short'])}
                              placeholder={'Emit once'} 
                              onChange={(e) => this.onEmitterPropertyChanged(id, 'autoEmitIntervalMs', parseInt(e.target.value))} defaultValue={thisEmitter.autoEmitIntervalMs}/> ms
                            <br/><small>Optional, leave blank to emit once at a time.</small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr/>
                    <Row>
                      <Col md={6}>
                        <p>Request</p>
                        <div style={{
                          overflowY: 'auto', 
                          height: 150,
                          fontSize: 12
                        }} ref={nodeElm => nodeElm && nodeElm.children.length < 1 && nodeElm.appendChild(this.getEditor(id, thisEmitter.request).getWrapperElement())}/>
                      </Col>
                      <Col md={6}>
                        <p>Last emitted request detail</p>
                        <pre style={{
                          overflowY: 'auto', 
                          width: '100%', 
                          height: 150, 
                          backgroundColor: '#111', 
                          margin: 0, 
                          padding: 10,
                          boxSizing: 'border-box'
                        }}>
                          {thisEmitter.requestedDetail}
                        </pre>
                        <br/>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div style={{display: 'inline-block'}} className={style['buttons']}>
                          <button 
                            onClick={(e) => (thisEmitter.isOnAutoEmit) ? e.target.dispatchEvent(this.stopEmitEvent) : this.onEmitEvent(e, id) } 
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
                          <span>
                            Connection state:
                            <strong style={{
                              color: getSocketStateColor(thisEmitter.currentState)
                            }}
                            > {thisEmitter.currentState}
                            </strong>
                          </span>
                          {/* <button onClick={(e) => this.onEmitEvent(e, id)} className={style['button']}>Stop</button> */}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                )
              })}
              <button 
                onClick={onAddEmitter} 
                className={style['button']}
              >
              + Add new emitter
              </button>
            </div>
          </TabPanel>
          <TabPanel hidden={currentTabIndex == 0} className={style['react-tab-panel']}>
            <div className={style['container']}>
              <button 
                onClick={this.onAddListener} 
                className={style['button']}
              >
              + Add new listener
              </button>
            </div>
          </TabPanel>
        </Tabs>
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