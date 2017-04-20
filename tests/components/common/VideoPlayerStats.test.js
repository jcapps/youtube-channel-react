import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {mount} from 'enzyme';
import VideoPlayerStats from '../../../src/components/common/VideoPlayerStats';

describe('VideoPlayerStats', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            video: {
                statistics: {
                    likeCount: '10',
                    dislikeCount: '1',
                    viewCount: '1000'
                }
            }
        };
    });

    it('Should setLikeBarWidths on mount', () => {
        // arrange
        const spyAction = sinon.spy(VideoPlayerStats.prototype, 'setLikeBarWidths');

        // act
        const component = mount(<VideoPlayerStats {...props}/>);

        // assert
        expect(spyAction.calledOnce).toEqual(true);
        spyAction.restore();
    });

    it('Should create video-stats div', () => {
        // act
        const component = mount(<VideoPlayerStats {...props}/>);
        const statsDiv = component.find('div.video-stats');

        // assert
        expect(statsDiv.length).toEqual(1);
    });

    it('Should create like-bar container div', () => {
        // act
        const component = mount(<VideoPlayerStats {...props}/>);
        const container = component.find('#like-bar-container');
        const likeBar = container.find('#like-bar');
        const dislikeBar = container.find('#dislike-bar');
        const emptyBar = container.find('#empty-bar');

        // assert
        expect(container.length).toEqual(1);
        expect(likeBar.length).toEqual(1);
        expect(dislikeBar.length).toEqual(1);
        expect(emptyBar.length).toEqual(0);
    });

    it('Should create an \'empty\' like bar when likes and dislikes are 0', () => {
        // arrange
        props.video.statistics = {
            viewCount: '1000',
            likeCount: '0',
            dislikeCount: '0'
        };

        // act
        const component = mount(<VideoPlayerStats {...props}/>);
        const container = component.find('#like-bar-container');
        const emptyBar = container.find('#empty-bar');

        // assert
        expect(container.length).toEqual(1);
        expect(emptyBar.length).toEqual(1);
    });

    it('Should create stats div', () => {
        // act
        const component = mount(<VideoPlayerStats {...props}/>);
        const stats = component.find('#stats');
        const likesDislikes = stats.find('#likes-dislikes');
        const likes = likesDislikes.find('#likes');
        const dislikes = likesDislikes.find('#dislikes');
        const views = stats.find('#views');
        const endDiv = stats.find('#end-stats');

        // assert
        expect(stats.length).toEqual(1);
        expect(likesDislikes.length).toEqual(1);
        expect(likes.length).toEqual(1);
        expect(dislikes.length).toEqual(1);
        expect(views.length).toEqual(1);
        expect(endDiv.length).toEqual(1);
        expect(likesDislikes.text()).toEqual('Likes: 10 - 1');
        expect(views.text()).toEqual('Views: 1,000');
    });
});