// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux' 
import Home from '../components/Home';
import * as GrpcActions from '../actions/grpc';

function mapStateToProps(state) {
  return {
    protos: state.protos
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GrpcActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
