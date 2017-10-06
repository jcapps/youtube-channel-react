import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function filterStateReducer(state = initialState.filterState, action) {
    switch(action.type) {
        case types.SET_FILTER_STATE:
            return action.state;
        default:
            return state;
    }
}