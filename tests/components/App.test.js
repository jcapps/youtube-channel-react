import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import App from '../../src/components/App';
import Header from '../../src/components/common/Header';

describe('App', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {children: <div>Content</div>};
    });

    it('Should create the Header', () => {
        // act
        const component = shallow(<App {...props}/>);
        const header = component.find(Header);
        
        // assert
        expect(header.length).toEqual(1);
    });

    it('Should create the page content', () => {
        // act
        const component = shallow(<App {...props}/>);
        const content = component.find('#content');
        
        // assert
        expect(content.children('div').text()).toEqual('Content');
    });
});