// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import Form from "react-jsonschema-form";
import protobuf from "protobufjs";
import { AddProtoService } from "../actions/grpc";

const ipc = require('electron').ipcRenderer
const grpc = require('grpc')
// const fs = require('fs');
const net = require('net');
// const grpc = require('grpc');
// const fmt = require('util').format;
// const repl = require('repl');
// const inquirer = require('inquirer');
// const _eval = require('eval');
// const vm = require('vm');

const selectDirBtn = document.getElementById('select-directory')

function foundServiceClient(obj) {
  return Object.keys(obj).some(key => obj[key].service) > 0;
}

function findService(def, n){
  let keys = Object.keys(def);
  let found = [];
  let m = n || 0;

  if (m > 5) return [];

  for(let i=0; i < keys.length; i++){
    let propName = keys[i]
    let propValue = def[propName];

    if(typeof propValue === 'object'){
      findService(propValue, m++).forEach(res => {
        res.package = `${propName}${res.package ? '.' + res.package : ''}`;
        found.push(res);
      });
    } else if(propValue.service){
      found.push({serviceName: propName, def: propValue});
    }
  }

  return found;
}

ipc.on('selected-directory', function (event, path) {
  
  const args = {
    proto: path,
    address: '127.0.0.1:5000',
    creds: grpc.credentials.createInsecure()
  }

  let parsed = grpc.load(path[0]);

  if(foundServiceClient(parsed)){
    parsed = { 'unknown': parsed };
  }
  let services = [];

  findService(parsed).forEach(def => {
    let desc = {}
    desc.package = def.package;
    desc.name = def.serviceName;
    desc.fqn = `${desc.package}.${desc.name}`;
    desc.def = def.def;
    services.push(desc);
  });

  var runGameBotService = services[0].def.service.runGameBot;

  var client = new grpc.Client('http://localhost:5000', args.creds);
  client.makeUnaryRequest(runGameBotService.path, 
    (val) => {
      return Buffer.from(JSON.stringify(val))
    },
    (data) => {
      return JSON.parse(data.toString())
    }, { gamebotId: 4 }, null, null,
    (err, resp) => {
      console.log(resp);
    });
  // client.makeUnaryRequest(services[0], servi)

  // try communicate with server
  

  //try first service
  // let client = new services[0].def(args.address, args.creds);

  // if (services.length === 0) {
  //   console.error('Unable to find any service in proto file');
  // } else if (services.length === 1) {
  //   services.map((service) => {
  //     Object.keys(service.def.service).map(name => {
  //       console.log(name);
  //     });
  //   })
    
  // }
})

const schema = {
  type: "object",
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};

const log = (type) => console.log.bind(console, type);

type Props = {};

export default class Home extends Component {

  // componentDidMount(){
  //   this.props.GetAllProto();
  // }

  onOpenFileClick = (event) => {
    ipc.send('open-file-dialog')
  }
  
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
        <h3>GRPC Client</h3>
          <ul>
          {/* {this.props.protos.length > 0 && this.props.protos.map((proto) => {
            return <li>proto</li>
          })} */}
          </ul>
          <button className={"select-directory"} style={{ width: 200, height: 50}} onClick={this.onOpenFileClick}>
            Open file...
          </button>
          {this.props.protos &&
          <Form schema={schema}
            onChange={log("changed")}
            onSubmit={log("submitted")}
            onError={log("errors")} />
          }
        </div>
      </div>
    );
  }
}
