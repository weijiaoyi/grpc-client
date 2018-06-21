// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GrpcBase } from './GrpcBase';
import { Link } from 'react-router-dom';
import { ipcRenderer as ipc } from 'electron';
import grpc from 'grpc';
import { bindActionCreators } from 'redux';
import * as GrpcActions from '../actions/grpc';
import { Grid, Row, Col } from 'react-flexbox-grid';
import GrpcForm from '../components/GrpcForm';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TableGrid from '../components/TableGrid';

import style from '../styles/style.scss';
import classNames from 'classnames'

function mapStateToProps(state) {
  return {
    protos: state.grpcReducer.protos,
    services: state.grpcReducer.services,
    fields: state.grpcReducer.fields,
    metadata: state.grpcReducer.metadata,
    responseMessage: state.grpcReducer.responseMessage
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
    ipc.on('selected-directory', function(event, path) {
      let parsed = grpc.load(path[0]);

      //Check if proto file has any service available.
      if(this.findService(parsed).length > 0){
        this.props.AddProto({
          name: path[0].replace(/^.*[\\\/]/, ''),
          path: path[0],
          isSelected: false
        });
      }
      //todo: print message to user - 'not found any service'
    }.bind(this))
  }

  onProtoFileClicked = (proto) => {
    
    if(proto.isSelected) return;
    
    this.props.ClearServices();
    this.props.ClearFields();

    let parsed = grpc.load(proto.path);

    console.log(parsed);

    if(this.foundServiceClient(parsed)){
      parsed = { 'unknown': parsed };
    }
    let protobufs = [];

    this.findService(parsed).forEach(def => {
      let desc = {}
      desc.package = def.package;
      desc.name = def.serviceName;
      desc.fqn = `${desc.package}.${desc.name}`;
      desc.def = def.def;
      protobufs.push(desc);
    });

    console.log(protobufs[0]);
    
    if(protobufs[0]){
      protobufs[0].def && Object.keys(protobufs[0].def.service).map((key) => {
        this.props.AddService({
          name: protobufs[0].def.service[key].originalName,
          path: protobufs[0].def.service[key].path,
          requestType: protobufs[0].def.service[key].requestType,
          responseType: protobufs[0].def.service[key].responseType,
          serviceClient: protobufs[0].def,
          isSelected: false
        });
      });
    }

    this.props.SelectProto(proto);
  }

  syntaxHighlight = (json) => {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  onGrpcFormSubmit = ({formData}) => {

    this.props.ClearResponseMessage();

    let endpointAddress = document.getElementById('endpoint').value;
    let clientDef = this.props.services.filter((service) => service.isSelected)[0];
    let client = new clientDef.serviceClient(endpointAddress, grpc.credentials.createInsecure());

    // console.log(clientDef);
    // console.log(client[clientDef.name]);

    let metadata = new grpc.Metadata();
    metadata.add('btt', '1');

    // client[clientDef.name](7, 
    //   (value) => Buffer.from(JSON.stringify(value), 'utf8'),
    //   (data) => JSON.parse(data),
    //   formData,
    //   metadata,
    //   {}, (err, resp) => {
    //     this.props.PrintMessage(this.syntaxHighlight(resp || err));
    //   }
    // );

    // client.makeUnaryRequest(clientDef.path, 
    //   (value) => Buffer.from(JSON.stringify(value), 'utf8'),
    //   (data) => JSON.parse(data),
    //   formData,
    //   metadata,
    //   {}, (err, resp) => {
    //     this.props.PrintMessage(this.syntaxHighlight(resp || err));
    //     // document.getElementById('responseTextArea').innerHTML = this.syntaxHighlight(resp || err);
    //     // console.log('Response: ', resp);
    //     // console.log('Error: ', err);
    //   }
    // );

    client[clientDef.name](formData, metadata: metadata, (err, resp) => {
      this.props.PrintMessage(this.syntaxHighlight(resp || err));
    });
  }

  onServiceClicked = (service) => {
    if(service.isSelected) return;
    this.props.ClearFields();
    this.props.SelectService(service);
  }

  onOpenFileClick = (event) => {
    ipc.send('open-file-dialog')
  }
  
  render() {
    return (
      <div>
        <div data-tid="container">
          <button className={classNames("select-directory", style.button, style.long)} onClick={this.onOpenFileClick}>
            Import file...
          </button>
          <div style={{'float': 'right'}}>
            Environment: <input type='text' defaultValue={'localhost:5000'} placeholder={'e.g.: localhost:5000'} id={'endpoint'}/>
          </div>
          <hr/>
          <Grid fluid className={style['grpc-grid']}>
            <Row className={style['grpc-grid-row']}>
              <Col sm={6} className={style['grpc-grid-col']}>
                <h3>Proto files</h3>
                <hr/>
                {this.props.protos && this.props.protos.map(proto => {
                  return <div key={proto.name} 
                  onClick={() => this.onProtoFileClicked(proto)} 
                  className={classNames(style['grpc-grid-col-item'], style['text-not-selectable'], proto.isSelected && style['active'])}
                  >
                  {proto.name}
                  </div>
                })}
              </Col>
              <Col sm={6} className={style['grpc-grid-col']}>
                <h3>Services</h3>
                <hr/>
                {this.props.services && this.props.services.map((service) => {
                  return <div key={service.name} 
                  onClick={() => this.onServiceClicked(service) }
                  className={classNames(style['grpc-grid-col-item'], style['text-not-selectable'], service.isSelected && style['active'])}
                  >
                  {service.name}
                  </div>
                })}
              </Col>
            </Row>
            <Row className={style['grpc-grid-row']}>
              <Col sm={12} className={style['grpc-grid-col']}>
                <Tabs className={style['react-tabs']}
                  selectedTabClassName={style['selected']}
                >
                  <TabList className={style['react-tab-list']}>
                    <Tab className={style['react-tab']}>Metadata</Tab>
                    <Tab className={style['react-tab']}>Fields</Tab>
                  </TabList>
                  <TabPanel className={style['react-tab-panel']}>
                    <TableGrid/>
                  </TabPanel>
                  <TabPanel className={style['react-tab-panel']}>
                    <GrpcForm 
                      fields={this.props.fields}
                      onFormSubmit={this.onGrpcFormSubmit}
                    />
                  </TabPanel>
                </Tabs>
              </Col>
            </Row>
            <Row className={style['grpc-grid-row']}>
              <Col sm={12} className={style['grpc-grid-col']}>
                <h3>Result</h3>
                <hr/>
                <pre>{this.props.responseMessage}</pre>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(GrpcRender)