import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getChannelInfoSuccess(channelInfo) {
    return { type: types.GET_CHANNEL_INFO_SUCCESS, channelInfo };
}

export function subscribeSuccess(success) {
    return { type: types.SUBSCRIBE_SUCCESS, success };
}

export function getChannelInfo() {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);
        dispatch(beginAjaxCall());
        return apiActions.getChannelInfo().then(channelInfo => {
            dispatch(getChannelInfoSuccess(channelInfo));
        }).catch(error => {
            throw(error);
        });
    };
}

export function subscribe() {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);
        dispatch(beginAjaxCall());
        return apiActions.subscribe().then(success => {
            dispatch(subscribeSuccess(success));
        }).catch(error => {
            throw(error);
        });
    };
}