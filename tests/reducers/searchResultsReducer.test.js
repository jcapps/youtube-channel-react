import expect from 'expect';
import searchResultsReducer from '../../src/reducers/searchResultsReducer';
import * as channelActions from '../../src/actions/channelActions';
import clearStore from '../../src/actions/clearAction';

describe('Search Results Reducer', () => {
    it('Should set searchResults when passed GET_SEARCH_RESULTS_SUCCESS', () => {
        // arrange
        const initialState = [];

        const searchResults = {
            items: [{video: 'A'}, {playlist: 'B'}]
        };
        const action = channelActions.getSearchResultsSuccess(searchResults);

        // act
        const newState = searchResultsReducer(initialState, action);

        // assert
        expect(newState).toEqual([{video: 'A'}, {playlist: 'B'}]);    
    });

    it('Should set searchResults when passed GET_NEXT_RESULTS_SUCCESS', () => {
        // arrange
        const initialState = [];

        const searchResults = {
            items: [{video: 'A'}, {playlist: 'B'}]
        };
        const action = channelActions.getNextResultsSuccess(searchResults);

        // act
        const newState = searchResultsReducer(initialState, action);

        // assert
        expect(newState).toEqual([{video: 'A'}, {playlist: 'B'}]);    
    });

    it('Should clear searchResults when passed CLEAR_STORE', () => {
        // arrange
        const initialState = [{video: 'A'}, {playlist: 'B'}];

        const action = clearStore();

        // act
        const newState = searchResultsReducer(initialState, action);

        // assert
        expect(newState).toEqual([]);
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = [];

        const searchResults = {
            items: [{video: 'A'}, {playlist: 'B'}]
        };
        const action = {type: 'DUMMY_ACTION_FAIL', searchResults};

        // act
        const newState = searchResultsReducer(initialState, action);

        // assert
        expect(newState).toEqual([]);   
    });
});