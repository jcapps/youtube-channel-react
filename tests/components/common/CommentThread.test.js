import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import * as commentActions from '../../../src/actions/commentActions';
import {CommentThread} from '../../../src/components/common/CommentThread';
import CommentBlock from '../../../src/components/common/CommentBlock';

describe('CommentThread', () => {
    let props;
    let mockGetReplies;
    let mockGetNextReplies;
    
    beforeEach(() => {
        // arrange
        props = {
            thread: {
                snippet: {
                    topLevelComment: {id: '11'},
                    totalReplyCount: '2'
                }
            },
            replies: {
                items: [
                    {id: '111'},
                    {id: '222'}
                ],
                nextPageToken: 'TOKEN'
            },
            videoId: '1',
            videoSeek: new Function(),
            actions: commentActions
        };

        mockGetReplies = sinon.stub(props.actions, 'getReplies');
        mockGetReplies.returns(new Promise((resolve, reject) => {
            resolve();
        }));

        mockGetNextReplies = sinon.stub(props.actions, 'getNextReplies');
        mockGetNextReplies.returns(new Promise((resolve, reject) => {
            resolve();
        }));
    });

    afterEach(() => {
        mockGetReplies.restore();
        mockGetNextReplies.restore();
    });

    it('Should load replies on mount', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);

        // assert
        expect(mockGetReplies.calledOnce).toEqual(true);
    });

    it('Should create a comment thread', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');

        // assert
        expect(commentThread.length).toEqual(1);
    });

    it('Should create the parent comment', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');
        const parentComment = commentThread.children(CommentBlock);

        // assert
        expect(parentComment.length).toEqual(1);
        expect(parentComment.props().comment).toEqual(props.thread.snippet.topLevelComment);
        expect(parentComment.props().videoId).toEqual(props.videoId);
        expect(parentComment.props().videoSeek).toEqual(props.videoSeek);
    });

    it('Should create replies', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const replyDivs = replySection.children('div');

        // assert
        expect(replySection.length).toEqual(1);
        expect(replyDivs.length).toEqual(3); // 2 replies, 1 'View More' link
        expect(replyDivs.at(2).find(CommentBlock).props().comment).toEqual(props.replies.items[0]);
        expect(replyDivs.at(2).find(CommentBlock).props().videoId).toEqual(props.videoId);
        expect(replyDivs.at(2).find(CommentBlock).props().videoSeek).toEqual(props.videoSeek);
    });

    it('Should create replies in descending order', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const replyDivs = replySection.children('div');

        // assert
        expect(replyDivs.at(1).find(CommentBlock).props().comment).toEqual(props.replies.items[1]);
        expect(replyDivs.at(2).find(CommentBlock).props().comment).toEqual(props.replies.items[0]);
    });

    it('Should create a "View More Replies" link if has nextPageToken', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const viewMore = replySection.find('a.view-more-replies');

        // assert
        expect(viewMore.length).toEqual(1);
        expect(viewMore.find('div').text()).toEqual('View More Replies');
    });

    it('Should not create a "View More" link if no nextPageToken exists', () => {
        // arrange
        props.replies.nextPageToken = "";
        
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const viewMore = replySection.find('a.view-more-replies');

        // assert
        expect(viewMore.length).toEqual(0);
    });

    it('Should load more replies when "View More Replies" is clicked', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const viewMore = replySection.find('a.view-more-replies');

        viewMore.simulate('click');

        // assert
        expect(mockGetNextReplies.calledOnce).toEqual(true);
    });

    it('Should show "Hide Replies" when canHideReplies = true', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        component.setState({ canHideReplies: true });
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const hideReplies = replySection.find('a.hide-replies');

        // assert
        expect(hideReplies.length).toEqual(1);
        expect(hideReplies.find('div').text()).toEqual('Hide Replies');
    });

    it('Should hide all but the most recent replies when "Hide Replies" is clicked', () => {
        // act
        const component = shallow(<CommentThread {...props}/>);
        component.setState({ canHideReplies: true });
        const commentThread = component.find('div.comment-thread');
        const replySection = commentThread.children('div.replies');
        const viewMore = replySection.find('a.view-more-replies');
        const hideReplies = replySection.find('a.hide-replies');

        mockGetReplies.reset();
        hideReplies.simulate('click');

        // assert
        expect(mockGetReplies.calledOnce).toEqual(true);
        expect(viewMore.length).toEqual(1);
    });
});