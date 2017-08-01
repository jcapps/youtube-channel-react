import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {MemoryRouter as Router} from 'react-router';
import SearchBar from '../../../src/components/common/SearchBar';

describe('SearchBar', () => {
    it('Should create a form', () => {
        // arrange, act
        const component = mount(<SearchBar.WrappedComponent/>);
        const form = component.find('form');

        // assert
        expect(form.length).toEqual(1);
    });

    it('Should create a search image', () => {
        // arrange, act
        const component = mount(<SearchBar.WrappedComponent/>);
        const image = component.find('img');
        const imageUrl = require('../../../src/images/search.png');

        // assert
        expect(image.length).toEqual(1);
        expect(image.prop('id')).toEqual('search-img');
        expect(image.prop('src')).toEqual(imageUrl);
        expect(image.prop('alt')).toEqual('Search');
    });

    it('Should create a search field', () => {
        // arrange, act
        const component = mount(<SearchBar.WrappedComponent/>);
        const searchField = component.find('input');

        // assert
        expect(searchField.length).toEqual(1);
        expect(searchField.prop('id')).toEqual('search');
        expect(searchField.prop('name')).toEqual('search');
        expect(searchField.prop('value')).toEqual('');
        expect(searchField.prop('placeholder')).toEqual('Search channel...');
        expect(searchField.prop('style')).toEqual({width: '0px'});
    });

    it('Should toggle searchbar width when clicked', () => {
        // arrange, act
        const mockFunction = sinon.stub(SearchBar.WrappedComponent.prototype, 'toggleSearchBar');
        const component = mount(<SearchBar.WrappedComponent/>);
        const image = component.find('img');

        image.simulate('click');

        // assert
        expect(mockFunction.calledOnce).toEqual(true);
        mockFunction.restore();
    });

    it('Should search onSubmit', () => {
        // arrange, act
        const mockFunction = sinon.stub(SearchBar.WrappedComponent.prototype, 'search');
        const component = mount(<Router><SearchBar/></Router>);
        const form = component.find('form');
        let searchField = component.find('input');

        form.simulate('submit');

        // assert
        expect(mockFunction.calledOnce).toEqual(true);
        mockFunction.restore();
    });
});