import React, {PropTypes} from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import {Header} from '../../../src/components/common/Header';
import TitleBar from '../../../src/components/common/TitleBar';
import SubscribeButton from '../../../src/components/common/SubscribeButton';
import NavBar from '../../../src/components/common/navbar/NavBar';

describe('Header', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {channel: {}}
    });

    it('Should create the TitleBar', () => {
        // act
        const component = shallow(<Header {...props}/>);
        const titlebar = component.find(TitleBar);

        // assert
        expect(titlebar.length).toEqual(1);
    });

    it('Should create the SubscribeButton', () => {
        // act
        const component = shallow(<Header {...props}/>);
        const subscribe = component.find(SubscribeButton);

        // assert
        expect(subscribe.length).toEqual(1);
    });

    it('Should create the NavBar', () => {
        // act
        const component = shallow(<Header {...props}/>);
        const navbar = component.find(NavBar);

        // assert
        expect(navbar.length).toEqual(1);
    });
});