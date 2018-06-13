import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddProtoService } from "../actions/grpc";



export class GrpcBase extends Component{
  
  log = (type) => {
    console.log.bind(console, type);
  }

  test = (msg) => {
    console.log(msg);
  }

  foundServiceClient = (obj) => {
    return Object.keys(obj).some(key => obj[key].service) > 0;
  }

  findService = (def, n) => {
    let keys = Object.keys(def);
    let found = [];
    let m = n || 0;
  
    if (m > 5) return [];
  
    for(let i=0; i < keys.length; i++){
      let propName = keys[i]
      let propValue = def[propName];
  
      if(typeof propValue === 'object'){
        this.findService(propValue, m++).forEach(res => {
          res.package = `${propName}${res.package ? '.' + res.package : ''}`;
          found.push(res);
        });
      } else if(propValue.service){
        found.push({serviceName: propName, def: propValue});
      }
    }
  
    return found;
  }
}

export default connect()(GrpcBase);