import {
  SET_UNIT,
} from '../../constants';

export function setUnit(unit) {
  return {
    type: SET_UNIT,
    unit: unit,
  };
}
