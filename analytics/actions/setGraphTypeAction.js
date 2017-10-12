import * as types from './actionTypes';

export function setGraphType(graphType) {
    return function(dispatch) {
        dispatch({ type: types.SET_GRAPH_TYPE, graphType });
    };
}