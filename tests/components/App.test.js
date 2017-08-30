import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import {App} from '../../src/components/App';
import Routes from '../../src/components/Routes';
import Header from '../../src/components/common/Header';

describe('App', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            isLoading: false
        };
    });

    it('Should create an empty div if still loading', () => {
        // arrange
        props.isLoading = true;
        
        // act
        const component = shallow(<App {...props} />);
        
        // assert
        expect(component.html()).toEqual('<div></div>');
    });

    it('Should create the Header', () => {
        // act
        const component = shallow(<App {...props} />);
        const header = component.find(Header);
        
        // assert
        expect(header.length).toEqual(1);
    });

    it('Should create the page content', () => {
        // act
        const component = shallow(<App {...props} />);
        const content = component.find('#content');
        const routes = content.find(Routes);
        
        // assert
        expect(content.length).toEqual(1);
        expect(routes.length).toEqual(1);
    });
});