import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function mostRecentUploadReducer(state = initialState.mostRecentUpload, action) {
    switch(action.type) {
        case types.GET_MOST_RECENT_UPLOAD_SUCCESS:
            return action.video.items[0];
        default:
            return state;
    }
}