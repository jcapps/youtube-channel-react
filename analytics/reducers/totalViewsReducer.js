import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function totalViewsReducer(state = initialState.totalViews, action) {
    switch(action.type) {
        case types.GET_TOTAL_VIEWS_SUCCESS:
            return action.report.rows[0][0];
        default:
            return state;
    }
}