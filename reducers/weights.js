
import {
  SET_UNIT,
} from '../constants'

const plates = {
  kg: [
    25,
    20,
    15,
    10,
    5,
    2.5,
    1.5,
    1.25,
    1.0,
    0.5,
    0.25,
  ],
  lb: [
    45,
    5,
    2.5,
  ]
}

const bars = {
  kg: [20, 15],
  lb: [40, 20],
}

const initialState = {
  plates: plates.kg,
  bars: bars.kg,
  units: ['kg', 'lb'],
}

export default function weightReducer(state = initialState, action) {
  switch (action.type) {
    case SET_UNIT:
      return { ...state, plates: plates[action.unit], bars: bars[action.unit]};
    default:
      return state;
  }
}
