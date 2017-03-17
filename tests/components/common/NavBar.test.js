import React from 'react';
import expect from 'expect';
import {Link, IndexLink} from 'react-router';
import {mount} from 'enzyme';
import {NavBar} from '../../../src/components/common/navbar/NavBar';

describe('NavBar', () => {
    let props;
    beforeEach(() => {
        // arrange
        props = {
            allPlaylists: [
                {id: '1', snippet: {title: 'Title 1'}},
                {id: '2', snippet: {title: 'Title 2'}},
                {id: '3', snippet: {title: 'Title 3'}},
                {id: '4', snippet: {title: 'Title 4'}},
                {id: '5', snippet: {title: 'Title 5'}},
                {id: '6', snippet: {title: 'Title 6'}},
                {id: '7', snippet: {title: 'Title 7'}},
                {id: '8', snippet: {title: 'Title 8'}},
                {id: '9', snippet: {title: 'Title 9'}}
            ]
        };
    });

    it('Should create "Home" link', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const menu = component.find('ul').first();
        const menuItems = menu.children('li');

        // assert
        expect(menuItems.at(0).find('div').text()).toEqual('Home');
        expect(menuItems.at(0).find(IndexLink).prop('to')).toEqual('/');
    });

    it('Should create "Playlists" link', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const menu = component.find('ul').first();
        const menuItems = menu.children('li');

        // assert
        expect(menuItems.at(1).find('div').first().text()).toEqual('Playlists');
        expect(menuItems.at(1).find(Link).first().prop('to')).toEqual('/playlists');
    });

    it('Should create "Videos" link', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const menu = component.find('ul').first();
        const menuItems = menu.children('li');

        // assert
        expect(menuItems.at(2).find('div').text()).toEqual('Videos');
        expect(menuItems.at(2).find(Link).prop('to')).toEqual('/videos');
    });

    it('Should create "About" link', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const menu = component.find('ul').first();
        const menuItems = menu.children('li');

        // assert
        expect(menuItems.at(3).find('div').text()).toEqual('About');
        expect(menuItems.at(3).find(Link).prop('to')).toEqual('/about');
    });

    it('Should create Playlist submenu of first 5 playlists', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const playlistMenu = component.find('li.has-submenu');
        const submenu = playlistMenu.find('ul');
        const submenuItems = submenu.find('li');

        // assert
        expect(submenuItems.length).toEqual(6);
        expect(submenuItems.at(0).find('div').text()).toEqual('Title 1');
        expect(submenuItems.at(1).find('div').text()).toEqual('Title 2');
        expect(submenuItems.at(2).find('div').text()).toEqual('Title 3');
        expect(submenuItems.at(3).find('div').text()).toEqual('Title 4');
        expect(submenuItems.at(4).find('div').text()).toEqual('Title 5');

        expect(submenuItems.at(0).find(Link).prop('to')).toEqual('/playlist/1');
        expect(submenuItems.at(1).find(Link).prop('to')).toEqual('/playlist/2');
        expect(submenuItems.at(2).find(Link).prop('to')).toEqual('/playlist/3');
        expect(submenuItems.at(3).find(Link).prop('to')).toEqual('/playlist/4');
        expect(submenuItems.at(4).find(Link).prop('to')).toEqual('/playlist/5');
    });

    it('Should create "View All" link in Playlist submenu', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const playlistMenu = component.find('li.has-submenu');
        const submenu = playlistMenu.find('ul');
        const submenuItems = submenu.find('li');

        // assert
        expect(submenuItems.at(5).find('div').text()).toEqual('View All');
        expect(submenuItems.at(5).find(Link).prop('to')).toEqual('/playlists');
    });

    it('Should initially hide submenu', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const playlistMenu = component.find('li.has-submenu');
        const submenu = playlistMenu.find('ul');

        // assert
        expect(submenu.hasClass('hidden')).toEqual(true);
    });

    it('Should show submenu on mouseOver', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const playlistMenu = component.find('li.has-submenu');
        const submenu = playlistMenu.find('ul');

        playlistMenu.simulate('mouseover');

        // assert
        expect(submenu.hasClass('hidden')).toEqual(false);
    });

    it('Should hide submenu on mouseOut', () => {
        // act
        const component = mount(<NavBar {...props}/>);
        const playlistMenu = component.find('li.has-submenu');
        const submenu = playlistMenu.find('ul');

        playlistMenu.simulate('mouseout');

        // assert
        expect(submenu.hasClass('hidden')).toEqual(true);
    });
});