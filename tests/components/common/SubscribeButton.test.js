import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {mount} from 'enzyme';
import SubscribeButton from '../../../src/components/common/SubscribeButton';
import * as youtubeActions from '../../../src/actions/youtubeActions';

describe('SubscribeButton', () => {
    it('Should create a "Subscribe" button', () => {
        // arrange, act
        const component = mount(<SubscribeButton/>);
        const button = component.find('button');

        // assert
        expect(button.length).toEqual(1);
        expect(button.text()).toEqual('Subscribe');
    });

    it('Should call subscribe method when clicked', () => {
        // arrange, act
        const mockAction = sinon.stub(youtubeActions, 'subscribe');

        const component = mount(<SubscribeButton/>);
        const button = component.find('button');

        button.simulate('click');

        // assert
        expect(mockAction.calledOnce).toEqual(true);
        mockAction.restore();
    });
});