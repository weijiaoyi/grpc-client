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
  return {
    ...state.spinner
  };
}

class Spinner extends Component {

  spinnerForm = React.createRef();

  onFormSubmit = async (formData) => {

    this.props.ToggleIsSpinning(true);

    this.props.ShowBetResult('');

    let betResult = this.props.betResult;

    const { bypassFeatureSpin, ...bodyData } = formData;

    if (!betResult.nextSpinId || (betResult.nextSpinType != 1 && !bypassFeatureSpin)) {
      betResult = await this.props.GetAndUpdateGameInfo(
        document.getElementById('endpoint').value,
        bodyData,
        "0_C",
        document.getElementById('sessionToken').value
      )
    }

    if (betResult.nextSpinId != undefined || betResult.nextSpinId != null) {
      await this.props.Spin(
        document.getElementById('endpoint').value, 
        bodyData,
        this.props.betResult.nextSpinId || betResult.nextSpinId,
        this.props.betResult.nextSpinType || betResult.nextSpinType,
        document.getElementById('sessionToken').value, bypassFeatureSpin);
      }
    this.props.ToggleIsSpinning(false);
  }

  onAutoSpinFormSubmit = async () => {

    const { autoSpinSetting } = this.props;
    const { interval } = autoSpinSetting;

    let autoSpin = setInterval(await this.onFormSubmit, interval);
    clearInterval(autoSpin);
  }

  onHeightChanged = (e) => {
    this.props.ChangeHeight(e.target.value);
  }

  onWidthChanged = (e) => {
    this.props.ChangeWidth(e.target.value);
  }

  onFormFieldChange = (formData: Object) => {
    
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

    let { isSpinning, betResultString, isOnAutoSpin, betSettings } = this.props;
    let { width, height } = this.props.reel;
    let { reel, nextSpinType, nextSpinId } = this.props.betResult;
    
    let betSettingFormFields = [
      {
        key: 'cs',
        fieldName: 'Coin size',
        type: 'number',
        required: true,
        defaultValue: betSettings.cs,
        step: 0.01,
      },
      {
        key: 'ml',
        fieldName: 'Multiplier',
        type: 'number',
        required: true,
        defaultValue: betSettings.ml,
        step: 1,
      },
      {
        key: 'mxl',
        fieldName: 'Lines Bet',
        type: 'number',
        required: true,
        defaultValue: betSettings.mxl,
        step: 1,
      },
      {
        key: 'pf',
        fieldName: 'Platform',
        type: 'number',
        required: true,
        defaultValue: 99,
        step: 1,
      },
      {
        key: 'bypassFeatureSpin',
        fieldName: 'Allow feature spin anyway',
        type: 'checkbox',
        required: false
      },
      {
        key: 'testModeId',
        fieldName: 'QA Test Mode Id (Leave blank for normal spin)',
        type: 'number',
        required: false,
        step: 1,
      },
      {
        key: 'autoSpin',
        fieldName: 'Enable Auto Spin',
        type: 'checkbox',
        required: false
      },
      {
        key: 'autoSpinInterval',
        fieldName: 'Auto Spin Interval (Milliseconds)',
        type: 'number',
        required: false,
        defaultValue: 1000,
        step: 1000,
      }
    ]
     
    let submitScheme = (
      <button role="button" 
        disabled={isSpinning} 
        className={classNames(style.button, style.big, (isSpinning ? '' : style.rainbow))} 
        type="submit">
        { isSpinning ? "SPINNING..." : "SPIN"}</button>
    )

    let autoSubmitScheme = (
      <button role="button" 
        className={classNames(style.button, style.big, (isSpinning ? '' : style.rainbow))}
        type="submit">
        { isOnAutoSpin ? "Stop" : "Start"}</button>
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
            onChange={this.onFormFieldChange}
            submitScheme={submitScheme}
          />
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