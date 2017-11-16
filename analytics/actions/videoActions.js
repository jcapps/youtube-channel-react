import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import * as youtubeActions from './youtubeActions';

export function getVideoSuccess(video) {
    return { type: types.GET_VIDEO_SUCCESS, video };
}

export function getVideoError(error) {
    return { type: types.GET_VIDEO_ERROR, error };
}

export function getVideo(id) {
    return function(dispatch) {
        dispatch(ajax.gettingVideo());
        return youtubeActions.getVideo(id).then(video => {
            dispatch(getVideoSuccess(video));
        }).catch(error => {
            dispatch(getVideoError(error));
        });
    };
}