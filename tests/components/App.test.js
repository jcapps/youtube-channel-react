import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import App from '../../src/components/App';
import Routes from '../../src/components/Routes';
import Header from '../../src/components/common/Header';

describe('App', () => {
    it('Should create the Header', () => {
        // act
        const component = shallow(<App />);
        const header = component.find(Header);
        
        // assert
        expect(header.length).toEqual(1);
    });

    it('Should create the page content', () => {
        // act
        const component = shallow(<App />);
        const content = component.find('#content');
        const routes = content.find(Routes);
        
        // assert
        expect(content.length).toEqual(1);
        expect(routes.length).toEqual(1);
    });
});