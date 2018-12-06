import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as SpinnerActions from '../actions/spinner';
import { connect } from 'react-redux';
import style from '../styles/style.scss';
import TableGrid from '../components/TableGrid';
import classNames from 'classnames';
import Form from "../components/Form";

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...SpinnerActions
    }, dispatch);
}

function mapStateToProps(state) {
  let { reel, nextSpinId, currentSpinId, isSpinning, betSettings, betResultString, betResult } = state.spinner;
  return {
    reel,
    nextSpinId,
    currentSpinId,
    isSpinning,
    betSettings,
    betResult,
    betResultString
  };
}

class Spinner extends Component {

  componentWillMount = () => {

  }

  onFormSubmit = async (formData: Object) => {

    this.props.ToggleIsSpinning(true);

    this.props.ShowBetResult('');

    let betResult = this.props.betResult;

    if (!betResult.nextSpinId || betResult.nextSpinType != 1) {
      betResult = await this.props.GetAndUpdateGameInfo(
        document.getElementById('endpoint').value,
        formData,
        "0_C",
        document.getElementById('sessionToken').value, 99
      )
    }

    if (betResult.nextSpinId) {
      await this.props.Spin(
        document.getElementById('endpoint').value, 
        formData,
        this.props.betResult.nextSpinId || betResult.nextSpinId,
        this.props.betResult.nextSpinType || betResult.nextSpinType,
        document.getElementById('sessionToken').value, 99);
      }
    this.props.ToggleIsSpinning(false);
  }

  onHeightChanged = (e) => {
    this.props.ChangeHeight(e.target.value);
  }

  onWidthChanged = (e) => {
    this.props.ChangeWidth(e.target.value);
  }

  resetBetResult = (e) => {
    this.props.ResetBetResult();
  }

  getTableData = (width: number, height: number, reelSerializeData: Array<number>): Array<Object> => {
    
    let rec: Array<Object> = [];

    if (reelSerializeData.length > 0) {
      for(let i = 0; i < height; i++) {
        let data: Object = {};
        for(let j = 0; j < width; j++) {

          let value: number = reelSerializeData[(j*height)+i];

          data = {
            ...data,
            [(j*height) + "-" + ((j+1)*height - 1)]: {
              value,
              className: style[`hm-${value}`]
            }
          }
        }
        rec.push(data);
      }
    }

    return rec;
  }

  render() {

    let { isSpinning, betResultString } = this.props;
    let { width, height } = this.props.reel;
    let { reel, nextSpinType, nextSpinId } = this.props.betResult;
    
    let betSettingFormFields = [
      {
        key: 'cs',
        fieldName: 'Coin size',
        type: 'number',
        required: true,
        defaultValue: 0.1,
        step: 0.01,
      },
      {
        key: 'ml',
        fieldName: 'Multiplier',
        type: 'number',
        required: true,
        defaultValue: 1,
        step: 1,
      },
      {
        key: 'mxl',
        fieldName: 'Lines Bet',
        type: 'number',
        required: true,
        defaultValue: 30,
        step: 1,
      }
    ]
     
    let submitScheme = (
      <button role="button" 
        disabled={isSpinning} 
        className={classNames(style.button, style.big)} 
        type="submit">
        { isSpinning ? "SPINNING..." : "SPIN"}</button>
    )
    return (
      <div>
        <div data-tid="container">
          <h3>Environment</h3>
          <hr/>
          <table className={style.mat2}>
            <tbody>
              <tr>
                <td>
                  <strong>GameAPI Url</strong>
                </td>
                <td>
                  <input type='text' onFocus={this.resetBetResult} className={style['full-width']} defaultValue={'https://api.dev.pgsoft.tech/game-api/diaochan/v2'} placeholder={'e.g.: https://api.dev.pgsoft.tech/game-api/diaochan/v2'} id={'endpoint'}/>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Session Token</strong>
                </td>
                <td>
                  <input type='text' onFocus={this.resetBetResult} placeholder={'e.g.: 789A2101-E7C4-4931-B09C-F6D381D0922D'} className={style['full-width']} id={'sessionToken'}/>
                </td>
              </tr>
            </tbody>
          </table>
          <br/>
          <h3>Reel Settings</h3>
          <hr/>
          <table className={style.mat2}>
            <tbody>
              <tr>
                <td>Width</td>
                <td><input type='number' min="1" defaultValue={width} onChange={this.onWidthChanged}/></td>
              </tr>
              <tr>
                <td>Height</td>
                <td><input type='number' min="1" defaultValue={height} onChange={this.onHeightChanged}/></td>
              </tr>
            </tbody>
          </table>
          <br/>
          <TableGrid
            rows = {this.getTableData(width, height, reel)}
            editable = {false}
            addable = {false}
          />
          <br/>
          <h3>Bet Settings</h3>
          <hr/>
          <table className={style.mat2}>
            <tbody>
              <tr>
                <td>Next Spin Id</td>
                <td><input disabled={true} readOnly={true} value={this.props.betResult.nextSpinId || "-"}/></td>
              </tr>
              <tr>
                <td>Next Spin Type</td>
                <td><input disabled={true} readOnly={true} value={this.props.betResult.nextSpinType || "-"}/></td>
              </tr>
            </tbody>
          </table>
          <Form
            form="SpinnerForm"
            fields={betSettingFormFields}
            initialValues=
            {
              betSettingFormFields.reduce((p, c) => {
                p[c.key] = c.defaultValue;
                return p;
              }, {})
            }
            onFormSubmit={this.onFormSubmit}
            onChange={this.props.ResetBetResult}
            submitScheme={submitScheme}
          />

            {/* <button
              className={style.button} 
              style={{width: '100%', height: '50px'}}
              onClick={this.Spin}
              disabled={isSpinning}>
                SPIN
            </button> */}
        </div>
        <br/>
        <br/>
        <h3>Bet Result</h3>
        <hr/>
        <pre className={style["response-text"]}>{betResultString}</pre>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Spinner);