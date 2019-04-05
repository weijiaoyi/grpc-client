import axios from 'axios';
import { jsonToUrlEncoded } from '../helpers/converter';
import { syntaxHighlight } from '../helpers/formatter';

import { BetResult } from '../reducers/spinnerReducer';

export const SPIN = "SPIN";
export const CHANGED_WIDTH = "CHANGED_WIDTH";
export const CHANGED_HEIGHT = "CHANGED_HEIGHT";
export const GET_UPDATE_GAMEINFO = "GET_UPDATE_GAMEINFO";
export const TOGGLE_IS_SPINNING = "TOGGLE_IS_SPINNING";
export const SHOW_BETRESULT = "SHOW_BETRESULT";
export const SET_BETRESULT = "SET_BETRESULT";
export const SET_BETSETTING = "SET_BETSETTING";
export const RESET_BETRESULT = "RESET_BETRESULT";
export const TOGGLE_AUTOSPIN = "TOGGLE_AUTOSPIN";
export const SET_AUTOSPINSETTINGS = "SET_AUTOSPINSETTINGS";

export function ChangeWidth(width: number) {
  return {
    type: CHANGED_WIDTH,
    payload: width
  };
}

export function ChangeHeight(height: number) {
  return {
    type: CHANGED_HEIGHT,
    payload: height
  };
}

export function Spin(
  url: string,
  betSetting: Object,
  nextSpinId: number,
  nextSpinType: number,
  sessionToken: string,
  bypassFeatureSpin: boolean = false
  ) : number 
  {

  return async (dispatch) => {
    try 
    {
      let nst = String(nextSpinType).charAt(0);

      if (!sessionToken)
        throw new Error("Spin: Session token is required to spin.");

      if (nst != '1' && !bypassFeatureSpin) 
        throw new Error(`Spin: This spinner tool currently only support spin type = 1 where the next spin type is ${nst}.
        \nIf you insist to spin with spin type = 1 settings, please tick 'Allow feature spin anyway' checkbox.`);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      let body = {
        ...betSetting,
        id: nextSpinId,
        atk: sessionToken,
        btt: 1,
        wk: "0_C"
      }

      let testModeId = betSetting.testModeId;
      let result = await axios.post(`${url}${(testModeId) ? `/qa/spin?tm=${testModeId}` : '/spin'}`, jsonToUrlEncoded(body), config);
      
      if (result.data.err) throw new Error(`Spin: Spin request return error: ${syntaxHighlight(result.data)}`)

      let betResult: BetResult = {
        nextSpinType: result.data.dt.si.nst,
        nextSpinId: result.data.dt.si.sid,
        reel: result.data.dt.si.rl
      }
      await dispatch(SetBetResult(betResult));
      await dispatch(ShowBetResult(syntaxHighlight(result.data)));
      await dispatch(ToggleIsSpinning(false));

      dispatch({
        type: SPIN,
        payload: (!result.data.err) ? result.data.dt.si.sid : null 
      });

    }catch(err) {
      console.error(`${err.message}`);
      await dispatch(ShowBetResult(`${err.message}`));
      await dispatch(ResetBetResult());
    }
  }
}

export function ToggleAutoSpin(enable: boolean) {
  return {
    type: TOGGLE_AUTOSPIN,
    payload: enable
  }
}

export function SetAutoSpinSettings(autoSpinSetting: Object) {
  return {
    type: SET_AUTOSPINSETTINGS,
    payload: autoSpinSetting
  }
}

export function SetBetSettings(betSetting: Object) {
  return {
    type: SET_BETSETTING,
    payload: betSetting
  }
}

export function SetBetResult(betResult: BetResult) {
  return {
    type: SET_BETRESULT,
    payload: betResult
  }
}

export function ToggleIsSpinning(enable: boolean) {
  return {
    type: TOGGLE_IS_SPINNING,
    payload: enable
  }
}

export function ShowBetResult(result: string) {
  return {
    type: SHOW_BETRESULT,
    payload: result
  }
}

export function ResetBetResult(){
  return {
    type: RESET_BETRESULT
  }
}

export function GetAndUpdateGameInfo(
  url: string,
  betSetting: Object,
  wallet: string,
  sessionToken: string
  ) : BetResult {

  return async (dispatch) => {

    try{

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      let body = {
        cs: betSetting.cs,
        wk: wallet,
        btt: 1,
        atk: sessionToken,
        pf: betSetting.pf
      }

      let getInfoBody = {
        btt: body.btt,
        atk: body.atk,
        pf: body.pf
      }

      let updateWalletBody = {
        btt: body.btt,
        atk: body.atk,
        wk: body.wk,
        pf: body.pf
      }

      let updateBetBody = {
        btt: body.btt,
        atk: body.atk,
        cs: body.cs,
        pf: body.pf
      }

      let result = await axios.post(`${url}/GameInfo/Get`, jsonToUrlEncoded(getInfoBody), config);

      await new Promise(resolve => setTimeout(resolve, 1000));

      result = await axios.post(`${url}/GameInfo/Update`, jsonToUrlEncoded(updateWalletBody), config);

      await new Promise(resolve => setTimeout(resolve, 1000));

      result = await axios.post(`${url}/GameInfo/Update`, jsonToUrlEncoded(updateBetBody), config);

      let betResult: BetResult = {};

      if (result.data.err) {
        await dispatch(ShowBetResult(syntaxHighlight(result.data.err)));
      }
      else
      {
        betResult = {
          reel: result.data.dt.ls.si.rl,
          nextSpinType: result.data.dt.ls.si.nst,
          nextSpinId: result.data.dt.ls.si.sid
        }
        await dispatch(SetBetResult(betResult));
      }

      dispatch({
        type: GET_UPDATE_GAMEINFO,
        payload: (result.data.dt) ? result.data.dt.ls.si.sid : null
      });

      return betResult;

    }catch(err) {
      console.error(err.message);
      await dispatch(ShowBetResult(`GetGameInfo: ${err.message}`));
      await dispatch(ToggleIsSpinning(false));
    }
  }
}

