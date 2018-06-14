// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GrpcBase } from './GrpcBase';
import { Link } from 'react-router-dom';
import Form from "react-jsonschema-form";
import protobuf from "protobufjs";
import { ipcRenderer as ipc } from 'electron';
import grpc from 'grpc';
import { bindActionCreators } from 'redux';
import * as GrpcActions from '../actions/grpc';
import { Grid, Row, Col } from 'react-flexbox-grid';

import style from '../styles/style.scss';
import classNames from 'classnames'

function mapStateToProps(state) {
  return {
    protos: state.grpcReducer.protos,
    services: state.grpcReducer.services
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GrpcActions, dispatch);
}

class GrpcRender extends GrpcBase {

  componentDidMount = () => {
    this.registerIpcEvents();
    this.props.GetStoredProtos();
  }

  registerIpcEvents = () => {
    const selectDirBtn = document.getElementById('select-directory')
    ipc.on('selected-directory', function(event, path) {
      let parsed = grpc.load(path[0]);

      //Check if proto file has any service available.
      if(this.findService(parsed).length > 0){
        this.props.AddProto({
          name: path[0].replace(/^.*[\\\/]/, ''),
          path: path[0],
          onClick: () => {
            this.onProtoFileClicked(path[0]);
          }
        });
      }
      //todo: print message to user - 'not found any service'
    }.bind(this))
  }

  onProtoFileClicked = (path) => {
    const args = {
      proto: path,
      address: '127.0.0.1:5000',
      creds: grpc.credentials.createInsecure()
    }

    let parsed = grpc.load(path);

    if(this.foundServiceClient(parsed)){
      parsed = { 'unknown': parsed };
    }
    let services = [];

    this.findService(parsed).forEach(def => {
      let desc = {}
      desc.package = def.package;
      desc.name = def.serviceName;
      desc.fqn = `${desc.package}.${desc.name}`;
      desc.def = def.def;
      services.push(desc);
    });

    let client = new services[0].def("localhost:5000", grpc.credentials.createInsecure());
    client.RunGameBot({gameBotId: 4}, (err, resp) => {
      console.log('Response: ', resp);
      console.log('Error: ', err);
    });
  }

  onOpenFileClick = (event) => {
    ipc.send('open-file-dialog')
  }
  
  render() {

    const schema = {
      type: "object",
      properties: {
        title: {type: "string", title: "Title", default: "A new task"},
        done: {type: "boolean", title: "Done?", default: false}
      }
    };
    
    return (
      <div>
        <div data-tid="container">
          <button className={"select-directory"} style={{ width: 200, height: 50}} onClick={this.onOpenFileClick}>
            Import file...
          </button>
          <hr/>
          <Grid fluid className={style['grpc-grid']}>
            <Row className={style['grpc-grid-row']}>
              <Col sm={6} className={style['grpc-grid-col']}>
                {this.props.protos && this.props.protos.map(proto => {
                  return <div key={proto.name} className={classNames(style['grpc-grid-col-item'], style['not-selectable'])}>{proto.name}</div>
                })}
              </Col>
              <Col sm={6} className={style['grpc-grid-col']}>
                <h1>Services here</h1>
              </Col>
            </Row>
            <Row className={style['grpc-grid-row']}>
              <Col sm={12}>
                <h1>Result</h1>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

 {/* <Form schema={schema}
            onChange={log("changed")}
            onSubmit={log("submitted")}
            onError={log("errors")} />
          } */}


export default connect(mapStateToProps, mapDispatchToProps)(GrpcRender)