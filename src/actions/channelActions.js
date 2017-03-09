import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getChannelInfoSuccess(channelInfo) {
    return { type: types.GET_CHANNEL_INFO_SUCCESS, channelInfo };
}

export function getChannelInfo() {
    return function(dispatch) {
        dispatch(beginAjaxCall());
        return youtubeActions.getChannelInfo().then(channelInfo => {
            dispatch(getChannelInfoSuccess(channelInfo));
        }).catch(error => {
            throw(error);
        });
    };
}