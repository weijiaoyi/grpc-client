import { SPIN, CHANGED_WIDTH, CHANGED_HEIGHT, TOGGLE_IS_SPINNING, 
  SHOW_BETRESULT, SET_BETRESULT, RESET_BETRESULT } from '../actions/spinner';
import { loadState } from '../localStorage';

export interface SpinnerState {
  reel: {
    width: number,
    height: number,
    current: Array
  },
  betSettings: Object,
  nextSpinId ?: number,
  currentSpinId ?: number,
  isSpinning: boolean,
  betResult: BetResult
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
  betSettings: {},
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