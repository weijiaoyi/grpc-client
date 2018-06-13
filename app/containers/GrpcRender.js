// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GrpcBase } from './GrpcBase';
import { Link } from 'react-router-dom';
import style from '../styles/style.scss';
import Form from "react-jsonschema-form";
import protobuf from "protobufjs";
import { ipcRenderer as ipc } from 'electron';
import grpc from 'grpc';
import { bindActionCreators } from 'redux';
import * as GrpcActions from '../actions/grpc';

function mapStateToProps(state) {
  return {
    protos: state.grpcReducer.protos
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
          path: path[0]
        });
      }
      //todo: print message to user - 'not found any service'
    }.bind(this))
  }

  onProtoFileClicked = () => {
    const args = {
      proto: path,
      address: '127.0.0.1:5000',
      creds: grpc.credentials.createInsecure()
    }

    let parsed = grpc.load(path[0]);

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

    console.log(this.props.protos);
    
    return (
      <div>
        <div className={style.container} data-tid="container">
        <h1>GRPC Client</h1>
          <button className={"select-directory"} style={{ width: 200, height: 50}} onClick={this.onOpenFileClick}>
            Open file...
          </button>
          <ul className={style.items}>
          {this.props.protos && this.props.protos.map(proto => {
            return <li key={proto.name} className={style.item}>{proto.name}</li>
          })}
          </ul>
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