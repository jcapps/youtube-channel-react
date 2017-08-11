import expect from 'expect';
import searchInfoReducer from '../../src/reducers/searchInfoReducer';
import * as channelActions from '../../src/actions/channelActions';
import clearStore from '../../src/actions/clearAction';

describe('Search Info Reducer', () => {
    it('Should set searchInfo when passed GET_SEARCH_RESULTS_SUCCESS', () => {
        // arrange
        const initialState = {};

        const searchResults = {
            pageInfo: {totalResults: 10}
        };
        const action = channelActions.getSearchResultsSuccess(searchResults);

        // act
        const newState = searchInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({totalResults: 10});    
    });

    it('Should set searchInfo when passed GET_NEXT_RESULTS_SUCCESS', () => {
        // arrange
        const initialState = {};
        
        const searchResults = {
            pageInfo: {totalResults: 10}
        };
        const action = channelActions.getNextResultsSuccess(searchResults);

        // act
        const newState = searchInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({totalResults: 10});    
    });

    it('Should clear searchInfo when passed CLEAR_STORE', () => {
        // arrange
        const initialState = {totalResults: 10};

        const action = clearStore();

        // act
        const newState = searchInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({totalResults: 0});
    });

    it('Should default to initial state when not passed a valid action', () => {
        // arrange
        const initialState = {totalResults: 0};
        
        const searchResults = {
            pageInfo: {totalResults: 10}
        };
        const action = {type: 'DUMMY_ACTION_FAIL', searchResults};

        // act
        const newState = searchInfoReducer(initialState, action);

        // assert
        expect(newState).toEqual({totalResults: 0});   
    });
});