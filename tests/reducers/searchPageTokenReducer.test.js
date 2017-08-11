import expect from 'expect';
import searchPageTokenReducer from '../../src/reducers/searchPageTokenReducer';
import * as channelActions from '../../src/actions/channelActions';
import clearStore from '../../src/actions/clearAction';

describe('Search Page Token Reducer', () => {
    it('Should set searchPageToken when passed GET_SEARCH_RESULTS_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const searchResults = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = channelActions.getSearchResultsSuccess(searchResults);

        // act
        const newState = searchPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });     
    });

    it('Should set searchPageToken when passed GET_NEXT_RESULTS_SUCCESS', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const searchResults = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = channelActions.getNextResultsSuccess(searchResults);

        // act
        const newState = searchPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        });     
    });

    it('Should clear searchPageToken when passed CLEAR_STORE', () => {
        // arrange
        const initialState = {prevPageToken: "XXXXX", nextPageToken: "YYYYY"};

        const action = clearStore();

        // act
        const newState = searchPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({prevPageToken: "", nextPageToken: ""});
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {prevPageToken: "", nextPageToken: ""};

        const searchResults = {
            prevPageToken: 'XXXXX',
            nextPageToken: 'YYYYY'
        };
        const action = {type: 'DUMMY_ACTION_FAIL', searchResults};

        // act
        const newState = searchPageTokenReducer(initialState, action);

        // assert
        expect(newState).toEqual({prevPageToken: "", nextPageToken: ""});    
    });
});