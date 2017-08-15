import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow, unmount} from 'enzyme';
import * as commentActions from '../../../../src/actions/commentActions';
import clearStore from '../../../../src/actions/clearAction';
import {VideoPlayerComments} from '../../../../src/components/common/player/VideoPlayerComments';
import CommentThread from '../../../../src/components/common/player/CommentThread';

describe('VideoPlayerComments', () => {
    let props;
    let retrievedComments;
    let mockGetComments;
    let mockGetNextComments;
    let mockClearStore;

    beforeEach(() => {
        // arrange
        props = {
            isLoading: false,
            comments: {},
            video: {
                id: '1',
                statistics: {
                    commentCount: 2
                }
            },
            videoSeek: new Function(),
            actions: commentActions,
            clearStore: () => clearStore
        };
        
        retrievedComments = {
            items: [
                {id: '11'},
                {id: '22'}
            ],
            nextPageToken: 'TOKEN'
        };

        mockGetComments = sinon.stub(props.actions, 'getComments');
        mockGetComments.resolves();

        mockGetNextComments = sinon.stub(props.actions, 'getNextComments');
        mockGetNextComments.resolves();

        mockClearStore = sinon.stub(props, 'clearStore');
        mockClearStore.resolves();
    });

    afterEach(() => {
        mockGetComments.restore();
        mockGetNextComments.restore();
        mockClearStore.restore();
    });

    it('Should load comments on mount', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);

        // assert
        expect(mockGetComments.calledOnce).toEqual(true);
    });

    it('Should create "Loading comments..." div when still retrieving data', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);

        // assert
        expect(component.text()).toEqual("(Loading comments...)");
    });

    it('Should create "Comments: 0" div when video has no comments', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.setProps({ comments: {items: []} });
        component.setState({ isLoading: false });

        // assert
        expect(component.text()).toEqual("Comments: 0");
    });

    it('Should create comments header', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.setProps({ comments: retrievedComments });
        component.setState({ isLoading: false });
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

        mockGetComments.resetHistory();
        commentSort.simulate('change', {target: {value: 'time'}});

        expect(mockGetComments.calledOnce).toEqual(true);
    });

    it('Should create comments section', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.setProps({ comments: retrievedComments });
        component.setState({ isLoading: false });
        const commentSection = component.find('div.comment-section');
        const commentThreads = commentSection.find(CommentThread);

        // assert
        expect(commentThreads.length).toEqual(2);
        expect(commentThreads.at(0).props().thread).toEqual(retrievedComments.items[0]);
        expect(commentThreads.at(1).props().thread).toEqual(retrievedComments.items[1]);
        expect(commentThreads.at(0).props().videoId).toEqual(props.video.id);
        expect(commentThreads.at(1).props().videoId).toEqual(props.video.id);
        expect(commentThreads.at(0).props().videoSeek).toEqual(props.videoSeek);
        expect(commentThreads.at(1).props().videoSeek).toEqual(props.videoSeek);
    });

    it('Should create a "View More" link if has nextPageToken', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.setProps({ comments: retrievedComments });
        component.setState({ isLoading: false });
        const commentSection = component.find('div.comment-section');
        const viewMore = commentSection.find('#view-more-comments');

        // assert
        expect(viewMore.length).toEqual(1);
        expect(viewMore.find('div').text()).toEqual('View More');
    });

    it('Should not create a "View More" link if no nextPageToken exists', () => {
        // arrange
        retrievedComments.nextPageToken = "";
        
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.setProps({ comments: retrievedComments });
        component.setState({ isLoading: false });
        const commentSection = component.find('div.comment-section');
        const viewMore = commentSection.find('#view-more-comments');

        // assert
        expect(viewMore.length).toEqual(0);
    });

    it('Should load more comments when "View More" is clicked', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.setProps({ comments: retrievedComments });
        component.setState({ isLoading: false });
        const commentSection = component.find('div.comment-section');
        const viewMore = commentSection.find('#view-more-comments');

        viewMore.simulate('click');

        // assert
        expect(mockGetNextComments.calledOnce).toEqual(true);
    });

    it('Should clearStore on unmount', () => {
        // act
        const component = shallow(<VideoPlayerComments {...props}/>);
        component.unmount();

        // assert
        expect(mockClearStore.calledOnce).toEqual(true);
    });
});