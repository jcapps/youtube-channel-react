import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function graphTypeReducer(state = initialState.graphType, action) {
    switch(action.type) {
        case types.SET_GRAPH_TYPE:
            return action.graphType;
        default:
            return state;
    }
}