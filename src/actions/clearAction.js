import * as types from './actionTypes';

export default function clearStore() {
    return { type: types.CLEAR_STORE };
}