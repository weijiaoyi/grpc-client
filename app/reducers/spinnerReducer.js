import { SPIN, CHANGED_WIDTH, CHANGED_HEIGHT, TOGGLE_IS_SPINNING, 
  SHOW_BETRESULT, SET_BETRESULT, SET_BETSETTING, RESET_BETRESULT,
  TOGGLE_AUTOSPIN, SET_AUTOSPINSETTINGS } from '../actions/spinner';
import { loadState } from '../localStorage';

export interface SpinnerState {
  reel: {
    width: number,
    height: number,
    current: Array
  },
  formData: {
    cs: number,
    ml: number,
    mxl: number,
    pf: number,
    bypassFeatureSpin: boolean
  },
  nextSpinId ?: number,
  currentSpinId ?: number,
  isSpinning: boolean,
  betResult: BetResult,
  isOnAutoSpin: boolean,
  autoSpinSetting: {
    interval: number
  }
}

export interface BetResult {
  nextSpinType: number,
  nextSpinId: number,
  reel: [],
}

const defaultState: SpinnerState = {
  reel: {
    width: 5,
    height: 3,
    current: []
  },
  betSettings: {
    cs: 0.1,
    ml: 1,
    mxl: 30
  },
  nextSpinId: null,
  currentSpinId: null,
  isSpinning: false,
  betResult: {
    nextSpinId: null,
    nextSpinType: null,
    reel: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]
  },
  betResultString: ''
}

// const defaultState: SpinnerState = {
//   ...loadState().spinner
// }

export default (state = defaultState, action) => {

  switch (action.type) {
    case SPIN:
      state = {
        ...state,
        nextSpinId: action.payload
      }
    break;

    case CHANGED_WIDTH:
      state = {
        ...state,
        reel: {
          ...state.reel,
          width: action.payload
        }
      };
    break;

    case CHANGED_HEIGHT:
      state = {
        ...state,
        reel: {
          ...state.reel,
          height: action.payload
        }
      };
    break;

    case TOGGLE_IS_SPINNING:
    state = {
      ...state,
      isSpinning: action.payload
    }
    break;

    case TOGGLE_AUTOSPIN:
    state = {
      ...state,
      isOnAutoSpin: action.payload
    }
    break;

    case SET_AUTOSPINSETTINGS:
    state = {
      ...state,
      autoSpinSetting: action.payload
    }
    break;

    case SET_BETSETTING:
    state = {
      ...state,
      betSettings: action.payload
    }
    break;

    case SHOW_BETRESULT:
    state = {
      ...state,
      betResultString: action.payload
    }
    break;

    case SET_BETRESULT:
    state = {
      ...state,
      betResult: action.payload
    }
    break;

    case RESET_BETRESULT:
    state = {
      ...state,
      nextSpinId: null,
      betResult: defaultState.betResult
    }
    break;
  }

  return state;
}