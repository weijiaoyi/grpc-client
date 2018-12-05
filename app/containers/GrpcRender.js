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
import GrpcForm from '../components/GrpcReduxForm';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TableGrid from '../components/TableGrid';
import Item from '../components/ListItem'
import { reset } from 'redux-form';

import style from '../styles/style.scss';
import classNames from 'classnames';
import { syntaxHighlight } from '../helpers/formatter'; 

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
  return bindActionCreators(
    {
      ...GrpcActions,
      reset
    }, dispatch);
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

  onProtoFileRemoved = (proto) => {
    this.props.RemoveProto(proto);
  }

  onProtoFileClicked = (proto) => {

    if(proto.isSelected) {
      this.onResetClicked();
      return;
    }
    
    this.props.ClearServices();
    this.props.ClearFields();

    let parsed = grpc.load(proto.path);

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

    this.props.ToggleProto(proto);
  }

  onGrpcFormSubmit = (formData) => {

    this.props.ClearResponseMessage();

    let endpointAddress = document.getElementById('endpoint').value;
    let clientDef = this.props.services.filter((service) => service.isSelected)[0];
    let client = new clientDef.serviceClient(endpointAddress, grpc.credentials.createInsecure());

    // console.log(clientDef);
    // console.log(client[clientDef.name]);

    let metadata = new grpc.Metadata();

    this.props.metadata.forEach((mt: GrpcActions.MetaData) => {
      metadata.add(mt.key.value, mt.value.value);
    });

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
      this.props.PrintMessage(syntaxHighlight(resp || err));
    });
  }

  updateMetadata = (tableRowsData) => {
    this.props.UpdateMetadata(tableRowsData);
  }

  onServiceClicked = (service) => {

    console.log(this.props.reset);
    this.props.reset('grpcForm');

    if(service.isSelected) return;
    this.props.ClearFields();
    this.props.SelectService(service);
  }

  onOpenFileClick = (event) => {
    ipc.send('open-file-dialog')
  }

  onResetClicked = () => {
    this.props.ClearFields();
    this.props.ClearServices();
    this.props.ClearResponseMessage();

    let selectedProto = this.props.protos.filter((proto) => proto.isSelected)[0];
    if(selectedProto) this.props.ToggleProto(selectedProto);
  }
  
  render() {

    let {protos, services, metadata, fields, responseMessage} = this.props;

    return (
      <div>
        <div>
          <div className={style['buttons']}>
            <button className={classNames("select-directory", style.button, style.long)} onClick={this.onOpenFileClick}>
              Import file...
            </button>
            <button className={classNames(style.button, style.danger)} onClick={this.onResetClicked}>
              Reset
            </button>
          </div>
          <div style={{'textAlign': 'right'}}>
            <table className={style.mat2} style={{marginLeft: 'auto'}}>
              <tbody>
                <tr>
                  <td>
                  <strong>Environment</strong>
                  </td>
                  <td>
                    <input type='text' className={style['full-width']} defaultValue={'localhost:5000'} placeholder={'e.g.: localhost:5000'} id={'endpoint'}/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr/>
          <Grid fluid className={style['grpc-grid']}>
            <Row className={style['grpc-grid-row']}>
              <Col sm={6} className={style['grpc-grid-col']}>
                <h3>Proto files</h3>
                {protos && protos.map(proto => {
                  return (
                  <Item
                    key={proto.name}
                    isActive={proto.isSelected}
                    onClick={() => this.onProtoFileClicked(proto)}
                    onRemove={ !proto.isSelected && (() => this.onProtoFileRemoved(proto))}
                  >
                    {proto.name}
                  </Item>
                  )
                })}
              </Col>
              <Col sm={6} className={style['grpc-grid-col']}>
                <h3>Services</h3>
                {services && services.map((service) => {
                  return (
                  <Item
                    key={service.name}
                    isActive={service.isSelected}
                    onClick={() => this.onServiceClicked(service)}
                  >
                    {service.name}
                  </Item>
                  )
                })}
              </Col>
            </Row>
            <Row className={style['grpc-grid-row']}>
              <Col sm={12} className={style['grpc-grid-col']}>
                <Tabs className={style['react-tabs']}
                  selectedTabClassName={style['selected']}
                  defaultIndex={1}
                >
                  <TabList className={style['react-tab-list']}>
                    <Tab className={style['react-tab']}>Metadata[WIP]</Tab>
                    <Tab className={style['react-tab']}>Fields</Tab>
                  </TabList>
                  <TabPanel className={style['react-tab-panel']}>
                    <TableGrid
                      rows = {metadata}
                      editable = {false}
                      addable = {false}
                      onEdited = {(tableData) => this.updateMetadata(tableData)}
                    />
                  </TabPanel>
                  <TabPanel className={style['react-tab-panel']}>
                    <GrpcForm 
                      fields={fields}
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
                <pre className={style["response-text"]}>{responseMessage}</pre>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(GrpcRender)


