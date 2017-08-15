import React from 'react';
import {bindActionCreators} from 'redux';
import expect from 'expect';
import {
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    connectOptions
} from '../../../../src/components/common/player/CommentThread';
import initialState from '../../../../src/reducers/initialState';
import * as commentActions from '../../../../src/actions/commentActions';

describe('Comment Thread Connect', () => {
    let state;

    beforeEach(() => {
        // arrange
        state = initialState;
    });

    it('Should mapStateToProps', () => {
        // arrange
        const expectedProps = {
            replies: state.replies
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
            actions: bindActionCreators(commentActions, dispatch)
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
            replies: state.replies
        };
        const actionProps = {
            actions: bindActionCreators(commentActions, dispatch)
        };
        const props = {
            thread: {},
            videoId: '0',
            videoSeek: () => {}
        };

        // act
        const mergedProps = mergeProps(stateProps, actionProps, props);

        const expectedProps = Object.assign({}, stateProps, actionProps, props);
        
        // assert
        expect(mergedProps).toEqual(expectedProps);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return false when next.thread.id === next.replies.items[0].snippet.parentId', () => {
        // arrange
        const prev = {};
        const next = {
            thread: {id: 'TEST'},
            replies: {
                items: [
                    {snippet: {parentId: 'TEST'}}
                ]
            }
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(false);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when next.thread.id !== next.replies.items[0].snippet.parentId', () => {
        // arrange
        const prev = {};
        const next = {
            thread: {id: 'TEST'},
            replies: {
                items: [
                    {snippet: {parentId: 'OTHER'}}
                ]
            }
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
    
    it('Should correctly check areMergedPropsEqual in connectOptions: return true when next.replies.items does not exist', () => {
        // arrange
        const prev = {};
        const next = {
            thread: {id: 'TEST'},
            replies: {}
        };

        // act
        const result = connectOptions.areMergedPropsEqual(next, prev);

        // assert
        expect(result).toEqual(true);
    });
});