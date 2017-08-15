import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import sinon from 'sinon';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../../src/components/common/player/VideoPlayerComments';
import initialState from '../../../../src/reducers/initialState';
import * as commentActions from '../../../../src/actions/commentActions';
import clearStore from '../../../../src/actions/clearAction';

describe('Video Player Comments Connect', () => {
    let state;
    let mockGetComments;

    beforeEach(() => {
        // arrange
        state = initialState;

        mockGetComments = sinon.stub(commentActions, 'getComments');
        mockGetComments.resolves();
    });

    afterEach(() => {
        mockGetComments.restore();
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            comments: state.comments,
            isLoading: state.ajaxCallsInProgress.comments > 0
        };

        // act
        const mappedProps = mapStateToProps(state);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should mapDispatchToProps', () => {
        // arrange
        const dispatch = () => {};
        const expectedProps = {
            actions: bindActionCreators(commentActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };

        // act
        const mappedProps = mapDispatchToProps(dispatch);

        // assert
        expect(mappedProps).toEqual(expectedProps);
    });

    it('Should mergeProps', () => {
        // arrange
        const dispatch = () => {};
        
        const stateProps = {
            comments: state.comments,
            isLoading: state.ajaxCallsInProgress.comments > 0
        };
        const actionProps = {
            actions: bindActionCreators(commentActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };
        const props = {
            video: {},
            videoSeek: () => {}
        };

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should mergeProps as well as getComments and set isLoading to "true" if comments exist, but not for the correct videoId', () => {
        // arrange
        const dispatch = () => {};
        
        const stateProps = {
            comments: {items: [{snippet: {videoId: 'XXXXX'}}]},
            isLoading: state.ajaxCallsInProgress.comments > 0
        };
        const actionProps = {
            actions: bindActionCreators(commentActions, dispatch),
            clearStore: bindActionCreators(clearStore, dispatch)
        };
        const props = {
            video: {id: 'YYYYY'},
            videoSeek: () => {}
        };

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        stateProps.isLoading = true;
        const expectedProps = Object.assign({}, stateProps, actionProps, props);

        // assert
        expect(mergedProps).toEqual(expectedProps);
        expect(mockGetComments.calledOnce).toEqual(true);
    });

    it('Should correctly check areMergedPropsEqual in connectOptions: return false when finished loading', () => {
        // arrange
        const prev = {
            isLoading: true,
            comments: {}
        };
        const next = {
            isLoading: false,
            comments: {items: [{snippet: {id: 'XXXXX'}}]}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return false when not loading, and prev and next comments are not equal', () => {
        // arrange
        const prev = {
            isLoading: false,
            comments: {items: [{id: 'XXXXX'}]}
        };
        const next = {
            isLoading: false,
            comments: {items: [{id: 'YYYYY'}]}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when isLoading', () => {
        // arrange
        const prev = {
            isLoading: true,
            comments: {}
        };
        const next = {
            isLoading: true,
            comments: {items: [{id: 'YYYYY'}]}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});