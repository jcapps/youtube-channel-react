import expect from 'expect';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import * as types from '../../src/actions/actionTypes';
import * as channelActions from '../../src/actions/channelActions';
import * as youtubeActions from '../../src/actions/youtubeActions';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Channel Actions', () => {
    describe('getChannelInfoSuccess', () => {
        it('Should create a GET_CHANNEL_INFO_SUCCESS action', () => {
            // arrange
            const channelInfo = {};
            const expectedAction = {
                type: types.GET_CHANNEL_INFO_SUCCESS,
                channelInfo: channelInfo
            };

            // act
            const action = channelActions.getChannelInfoSuccess(channelInfo);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getSearchResultsSuccess', () => {
        it('Should create a GET_SEARCH_RESULTS_SUCCESS action', () => {
            // arrange
            const result = [];
            const expectedAction = {
                type: types.GET_SEARCH_RESULTS_SUCCESS,
                result: result
            };

            // act
            const action = channelActions.getSearchResultsSuccess(result);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getNextResultsSuccess', () => {
        it('Should create a GET_NEXT_RESULTS_SUCCESS action', () => {
            // arrange
            const result = [];
            const expectedAction = {
                type: types.GET_NEXT_RESULTS_SUCCESS,
                result: result
            };

            // act
            const action = channelActions.getNextResultsSuccess(result);

            // assert
            expect(action).toEqual(expectedAction);
        });
    });

    describe('getChannelInfo', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_CHANNEL_INFO_SUCCESS actions', (done) => {
            // arrange
            const channelInfo= {};
            const expectedActions = {
                type: types.GET_CHANNEL_INFO_SUCCESS, 
                body: {channelInfo: channelInfo}
            };
            
            const store = mockStore({channelInfo: channelInfo}, expectedActions);

            let mockAction = sinon.stub(youtubeActions, 'getChannelInfo');
            mockAction.resolves(channelInfo);

            // act
            store.dispatch(channelActions.getChannelInfo()).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_CHANNEL_INFO_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getSearchResults', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_SEARCH_RESULTS_SUCCESS actions', (done) => {
            // arrange
            const result = [];
            const expectedAction = {
                type: types.GET_SEARCH_RESULTS_SUCCESS,
                result: result
            };
            
            const store = mockStore({searchResults: result}, expectedAction);

            let mockAction = sinon.stub(youtubeActions, 'searchChannel');
            mockAction.resolves(result);

            // act
            store.dispatch(channelActions.getSearchResults("QUERY")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_SEARCH_RESULTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });

    describe('getNextResults', () => {
        it('Should dispatch BEGIN_AJAX_CALL and GET_NEXT_RESULTS_SUCCESS actions', (done) => {
            // arrange
            const result = [];
            const expectedAction = {
                type: types.GET_NEXT_RESULTS_SUCCESS,
                result: result
            };
            
            const store = mockStore({searchResults: result}, expectedAction);

            let mockAction = sinon.stub(youtubeActions, 'searchChannel');
            mockAction.resolves({items: []});

            // act
            store.dispatch(channelActions.getNextResults("QUERY", "TOKEN")).then(() => {
                const actions = store.getActions();
                // assert
                expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
                expect(actions[1].type).toEqual(types.GET_NEXT_RESULTS_SUCCESS);
                mockAction.restore();
                done();
            });
        });
    });
});