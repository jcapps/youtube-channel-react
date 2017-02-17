import {bindActionCreators} from 'redux';
import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getVideoSuccess(video) {
    return { type: types.GET_VIDEO_SUCCESS, video };
}

export function getVideo(id) {
    return function(dispatch) {
        const apiActions = bindActionCreators(youtubeActions, dispatch);

        dispatch(beginAjaxCall());
        return apiActions.getVideoInfo(id).then(video => {
            dispatch(getVideoSuccess(video));
        });
    };
}