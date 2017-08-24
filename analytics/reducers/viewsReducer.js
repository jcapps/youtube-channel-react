import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function viewsReducer(state = initialState.views, action) {
    switch(action.type) {
        case types.GET_VIEWS_SUCCESS:
            return action.report;
        default:
            return state;
    }
}