import {
  SET_UNIT_KG,
  SET_UNIT_LB
} from '../../constants';

export function setUnitKG() {
  return {
    type: SET_UNIT_KG,
  };
}

export function setUnitLB() {
  return {
    type: SET_UNIT_LB,
  };
}
