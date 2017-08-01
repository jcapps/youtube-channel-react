import React from 'react';
import expect from 'expect';
import {shallow} from 'enzyme';
import {Switch, Route} from 'react-router';
import Routes from '../../src/components/Routes';

describe('Routes', () => {
    it('Should create Route Switch', () => {
        // act
        const component = shallow(<Routes />);
        const routeSwitch = component.find(Switch);
        
        // assert
        expect(component.length).toEqual(1);
        expect(routeSwitch.length).toEqual(1);
    });

    it('Should create Routes', () => {
        // act
        const component = shallow(<Routes />);
        const routes = component.find(Route);
        
        // assert
        expect(routes.length).toEqual(7);
    });
});