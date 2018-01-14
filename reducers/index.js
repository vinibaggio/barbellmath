import { combineReducers } from 'redux'
import weights from './weights'
import gym from './gym'

const rootReducer = combineReducers({
    weights,
    gym,
})

export default rootReducer
