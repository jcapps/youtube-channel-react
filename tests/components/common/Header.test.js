import React from 'react';
import expect from 'expect';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import * as playlistActions from '../../../src/actions/playlistActions';
import {Header} from '../../../src/components/common/Header';
import TitleBar from '../../../src/components/common/TitleBar';
import SubscribeButton from '../../../src/components/common/SubscribeButton';
import NavBar from '../../../src/components/common/navbar/NavBar';
import SearchBar from '../../../src/components/common/SearchBar';

describe('Header', () => {
    let props;
    let mockGetAllPlaylists;
    beforeEach(() => {
        // arrange
        props = {
            allPlaylists: [],
            channel: {},
            actions: playlistActions
        };
        mockGetAllPlaylists = sinon.stub(props.actions, 'getAllPlaylists');
        mockGetAllPlaylists.resolves();
    });
    afterEach(() => {
        mockGetAllPlaylists.restore();
    });

    it('Should create an empty div if still loading', () => {
        // act
        const component = shallow(<Header {...props}/>);
        
        // assert
        expect(component.html()).toEqual('<div></div>');
    });

    it('Should get allPlaylists on mount', () => {
        // act
        const component = shallow(<Header {...props}/>);
        
        // assert
        expect(mockGetAllPlaylists.calledOnce).toEqual(true);
    });

    it('Should create the TitleBar', () => {
        // act
        const component = shallow(<Header {...props}/>);
        component.setState({ isLoading: false });
        const titlebar = component.find(TitleBar);

        // assert
        expect(titlebar.length).toEqual(1);
        expect(titlebar.props()).toEqual({channel: props.channel});
    });

    it('Should create the SubscribeButton', () => {
        // act
        const component = shallow(<Header {...props}/>);
        component.setState({ isLoading: false });
        const subscribe = component.find(SubscribeButton);

        // assert
        expect(subscribe.length).toEqual(1);
    });

    it('Should create the NavBar', () => {
        // act
        const component = shallow(<Header {...props}/>);
        component.setState({ isLoading: false });
        const navbar = component.find(NavBar);

        // assert
        expect(navbar.length).toEqual(1);
        expect(navbar.props()).toEqual({allPlaylists: props.allPlaylists});
    });

    it('Should create the SearchBar', () => {
        // act
        const component = shallow(<Header {...props}/>);
        component.setState({ isLoading: false });
        const searchbar = component.find(SearchBar);

        // assert
        expect(searchbar.length).toEqual(1);
    });
});