import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {mount} from 'enzyme';
import CommentBlock from '../../../src/components/common/CommentBlock';

describe('CommentBlock', () => {
    let props;
    let mockVideoSeek;
    
    beforeEach(() => {
        // arrange
        props = {
            comment: {
                snippet: {
                    authorChannelUrl: 'test.url',
                    authorDisplayName: 'Test Name',
                    authorProfileImageUrl: 'test-image-s28.url',
                    likeCount: 3,
                    textDisplay: 'Test Text',
                    updatedAt: '2017-01-01T10:00:00.000Z'
                }
            },
            videoId: '1',
            videoSeek: new Function()
        };

        mockVideoSeek = sinon.stub(props, 'videoSeek');
        mockVideoSeek.returns(new Promise((resolve, reject) => {
            resolve();
        }));
    });

    afterEach(() => {
        mockVideoSeek.restore();
    });

    it('Should create a comment', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');

        // assert
        expect(comment.length).toEqual(1);
    });

    it('Should create user profile image', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const imageLink = comment.children('a');
        const image = imageLink.find('img');

        // assert
        expect(imageLink.length).toEqual(1);
        expect(image.length).toEqual(1);
        expect(imageLink.props().href).toEqual(props.comment.snippet.authorChannelUrl);
        expect(imageLink.props().target).toEqual('_blank');
        expect(image.props().src).toEqual('test-image-s60.url');
        expect(image.props().alt).toEqual('Profile Image');
    });

    it('Should create comment details', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');

        // assert
        expect(commentInfo.length).toEqual(1);
    });

    it('Should create channel name', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const channel = commentInfo.find('a.user-channel');
        const name = channel.find('div');

        // assert
        expect(channel.length).toEqual(1);
        expect(name.length).toEqual(1);
        expect(channel.props().href).toEqual(props.comment.snippet.authorChannelUrl);
        expect(channel.props().target).toEqual('_blank');
        expect(name.text()).toEqual(props.comment.snippet.authorDisplayName);
    });

    it('Should create time elapsed since comment was updated', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const timeElapsed = commentInfo.find('div.time-elapsed');

        // assert
        expect(timeElapsed.length).toEqual(1);
    });

    it('Should create comment text', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const commentText = commentInfo.find('div.comment-text');

        // assert
        expect(commentText.length).toEqual(1);
        expect(commentText.text()).toEqual(props.comment.snippet.textDisplay);
    });

    it('Should create new timestamp link if comment contains a timestamp', () => {
        // arrange
        props.comment.snippet.textDisplay = 'Test <a href="http://www.youtube.com/watch?v=' + props.videoId + '&amp;t=1m30s">1:30</a> Text';

        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const commentText = commentInfo.find('div.comment-text');
        const timestamp = commentText.find('a');

        // assert
        expect(commentText.length).toEqual(1);
        expect(timestamp.length).toEqual(1);
        expect(commentText.text()).toEqual('Test 1:30 Text');
        expect(timestamp.props().value).toEqual('1m30s');
    });

    it('Should call videoSeek if timestamp is clicked', () => {
        // arrange
        props.comment.snippet.textDisplay = 'Test <a href="http://www.youtube.com/watch?v=' + props.videoId + '&amp;t=1m30s">1:30</a> Text';

        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const commentText = commentInfo.find('div.comment-text');
        const timestamp = commentText.find('a');

        timestamp.simulate('click', {target: {value: '1m30s'}});

        // assert
        expect(mockVideoSeek.calledOnce).toEqual(true);
    });

    it('Should not have ability to expand comment when comment is small', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const readMore = commentInfo.find('a.read-more');

        // assert
        expect(readMore.length).toEqual(1);
        expect(readMore.hasClass('hidden')).toEqual(true);
    });

    it('Should create comment likes if likeCount > 0', () => {
        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const commentLikeLabel = commentInfo.find('span.like-label');
        const commentLikes = commentInfo.find('span.like-count');

        // assert
        expect(commentLikeLabel.length).toEqual(1);
        expect(commentLikes.length).toEqual(1);
        expect(commentLikeLabel.text()).toEqual('Likes: ');
        expect(commentLikes.text()).toEqual('3');
    });

    it('Should not create comment likes if likeCount = 0', () => {
        // arrange
        props.comment.snippet.likeCount = 0;

        // act
        const component = mount(<CommentBlock {...props}/>);
        const comment = component.find('div.comment');
        const commentInfo = comment.find('div.comment-info');
        const commentLikeLabel = commentInfo.find('span.like-label');
        const commentLikes = commentInfo.find('span.like-count');

        // assert
        expect(commentLikeLabel.length).toEqual(0);
        expect(commentLikes.length).toEqual(0);
    });
});