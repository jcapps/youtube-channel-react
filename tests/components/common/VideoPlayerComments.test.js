import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import * as commentActions from '../../../src/actions/commentActions';
import {VideoPlayerComments} from '../../../src/components/common/VideoPlayerComments';
import CommentThread from '../../../src/components/common/CommentThread';

describe('VideoPlayerComments', () => {
    let props;
    let mockGetComments;
    let mockGetNextComments;

    beforeEach(() => {
        // arrange
        props = {
            comments: {
                items: [
                    {id: '11'},
                    {id: '22'}
                ],
                nextPageToken: 'TOKEN'
            },
            video: {
                id: '1',
                statistics: {
                    commentCount: 2
                }
            },
            videoSeek: new Function(),
            actions: commentActions
        };

        mockGetComments = sinon.stub(props.actions, 'getComments');
        mockGetComments.returns(new Promise((resolve, reject) => {
            resolve();
        }));

        mockGetNextComments = sinon.stub(props.actions, 'getNextComments');
        mockGetNextComments.returns(new Promise((resolve, reject) => {
            resolve();
        }));
    });

    afterEach(() => {
        mockGetComments.restore();
        mockGetNextComments.restore();
    });

    it('Should load comments on mount', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);

        // assert
        expect(mockGetComments.calledOnce).toEqual(true);
    });

    it('Should create "Loading comments..." div when still retrieving data', () => {
        // arrange
        props.comments = {};

        // act
        const component = shallow(<VideoPlayerComments {...props}/>);

        // assert
        expect(component.text()).toEqual("(Loading comments...)");
    });

    it('Should create "Comments: 0" div when video has no comments', () => {
        // arrange
        props.comments = {items: []};

        // act
        const component = shallow(<VideoPlayerComments {...props}/>);

        // assert
        expect(component.text()).toEqual("Comments: 0");
    });

    it('Should create comments header', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        const commentHeader = component.find('div.comment-header');
        const commentStats = commentHeader.find('div.comment-stats');
        const commentSort = commentHeader.find('select.comment-sort');

        // assert
        expect(commentStats.length).toEqual(1);
        expect(commentSort.length).toEqual(1);
        expect(commentStats.text()).toEqual('Comments: 2');
        expect(commentSort.props().value).toEqual('relevance');
        expect(commentSort.children('option').length).toEqual(2);
        expect(commentSort.children('option').at(0).props().value).toEqual('relevance');
        expect(commentSort.children('option').at(1).props().value).toEqual('time');
        expect(commentSort.children('option').at(0).text()).toEqual('Relevance');
        expect(commentSort.children('option').at(1).text()).toEqual('Most Recent');

        mockGetComments.reset();
        commentSort.simulate('change', {target: {value: 'time'}});

        expect(mockGetComments.calledOnce).toEqual(true);
    });

    it('Should create comments section', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        const commentSection = component.find('div.comment-section');
        const commentThreads = commentSection.find(CommentThread);

        // assert
        expect(commentThreads.length).toEqual(2);
        expect(commentThreads.at(0).props().thread).toEqual(props.comments.items[0]);
        expect(commentThreads.at(1).props().thread).toEqual(props.comments.items[1]);
        expect(commentThreads.at(0).props().videoId).toEqual(props.video.id);
        expect(commentThreads.at(1).props().videoId).toEqual(props.video.id);
        expect(commentThreads.at(0).props().videoSeek).toEqual(props.videoSeek);
        expect(commentThreads.at(1).props().videoSeek).toEqual(props.videoSeek);
    });

    it('Should create a "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        const commentSection = component.find('div.comment-section');
        const viewMore = commentSection.find('#view-more-comments');

        // assert
        expect(viewMore.length).toEqual(1);
        expect(viewMore.find('div').text()).toEqual('View More');
    });

    it('Should not create a "View More" link if no nextPageToken exists', () => {
        // arrange
        props.comments.nextPageToken = "";
        
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        const commentSection = component.find('div.comment-section');
        const viewMore = commentSection.find('#view-more-comments');

        // assert
        expect(viewMore.length).toEqual(0);
    });

    it('Should load more comments when "View More" is clicked', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        const commentSection = component.find('div.comment-section');
        const viewMore = commentSection.find('#view-more-comments');

        viewMore.simulate('click');

        // assert
        expect(mockGetNextComments.calledOnce).toEqual(true);
    });
});