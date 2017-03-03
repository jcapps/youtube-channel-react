import expect from 'expect';
import channelInfoReducer from '../../src/reducers/channelInfoReducer';
import * as channelActions from '../../src/actions/channelActions';

describe('Channel Info Reducer', () => {
    it('Should set channelInfo when passed GET_CHANNEL_INFO_SUCCESS', () => {
        // arrange
        const initialState = {};

        const channelInfo = {
            items: [{ id: 'XXXXX' }]
        };
        const action = channelActions.getChannelInfoSuccess(channelInfo);

        // act
        const newState = channelInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({id: 'XXXXX'});    
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {};

        const channelInfo = {
            items: [{ id: 'XXXXX' }]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', channelInfo};

        // act
        const newState = channelInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({});    
    });
});