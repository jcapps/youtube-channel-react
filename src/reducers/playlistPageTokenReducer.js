import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function playlistPageTokenReducer(state = initialState.playlistPageToken, action) {
    switch(action.type) {
        case types.GET_ALL_PLAYLISTS_SUCCESS:
            return {
                prevPageToken: action.playlists.prevPageToken,
                nextPageToken: action.playlists.nextPageToken
            };
        case types.GET_NEXT_PLAYLISTS_SUCCESS:
            return {
                prevPageToken: action.playlists.prevPageToken,
                nextPageToken: action.playlists.nextPageToken
            };
        default:
            return state;
    }
}