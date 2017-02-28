import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function channelInfoReducer(state = initialState.channelInfo, action) {
    switch(action.type) {
        case types.GET_CHANNEL_INFO_SUCCESS:
            return action.channelInfo.items[0];
        default:
            return state;
    }
}