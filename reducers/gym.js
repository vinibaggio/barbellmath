
import {
  SET_NAME,
  SET_UNIT,
} from '../constants'

const initialState = {
  name: 'Unnamed gym',
  unit: 'kg',
}

export default function gymReducer(state = initialState, action) {
  switch (action.type) {
    case SET_UNIT:
      return { ...state, unit: action.unit };
    case SET_NAME:
      return { ...state, name: action.name };
    default:
      return state;
  }
}
