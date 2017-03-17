import React from 'react';
import expect from 'expect';
import {mount} from 'enzyme';
import VideoPlayerDescription from '../../../src/components/common/VideoPlayerDescription';

describe('VideoPlayerDescription', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            video: {
                snippet: {
                    title: 'Title | Test Video', 
                    description: 'Test Description\nCreated by: Me\nAssembled by: Me'
                }
            }
        };
    });

    it('Should create a details div', () => {
        // act
        const component = mount(<VideoPlayerDescription {...props}/>);
        const detailsDiv = component.find('div.video-details');

        // assert
        expect(detailsDiv.length).toEqual(1);
    });

    it('Should create title in details', () => {
        // act
        const component = mount(<VideoPlayerDescription {...props}/>);
        const detailsDiv = component.find('div.video-details');
        const title = detailsDiv.find('h3').text();
        const subTitle = detailsDiv.find('h4').text();

        // assert
        expect(title).toEqual('Title');
        expect(subTitle).toEqual('Test Video');
    });

    it('Should create description in details', () => {
        // act
        const component = mount(<VideoPlayerDescription {...props}/>);
        const detailsDiv = component.find('div.video-details');
        const description = detailsDiv.find('p');
        const descriptionParts = description.find('span');

        // assert
        expect(descriptionParts.length).toEqual(3);
        expect(descriptionParts.at(0).text()).toEqual('Test Description');
        expect(descriptionParts.at(1).text()).toEqual('Created by: Me');
        expect(descriptionParts.at(2).text()).toEqual('Assembled by: Me');
    });
});