import React, {PropTypes} from 'react';

class SearchBar extends React.Component {
    constructor(context) {
        super(context);
        this.state = {
            searchText: ''
        };
        
        this.updateText = this.updateText.bind(this);
        this.toggleSearchBar = this.toggleSearchBar.bind(this);
        this.search = this.search.bind(this);
    }

    updateText(e) {
        this.setState({searchText: e.target.value});
    }

    search(e) {
        e.preventDefault();
        const query = this.state.searchText;
        this.context.router.push('/search/' + query);
    }

    toggleSearchBar() {
        const searchBar = document.getElementById('search');
        if (searchBar.style.width === '200px') {
            searchBar.style.width = '0';
        } else {
            searchBar.style.width = '200px';
            searchBar.focus();
        }
    }
    
    render() {
        const searchImgUrl = require('../../images/search.png');
        return (
            <div id="searchbar">
                <form onSubmit={this.search}>
                    <img onClick={this.toggleSearchBar}
                        id="search-img"
                        src={searchImgUrl}
                        alt="Search" />
                    <input
                        id="search"
                        name="search"
                        value={this.state.searchText}
                        placeholder="Search channel..."
                        onChange={this.updateText}
                        style={{width: '0px'}}/>
                </form>
            </div>
        );
    }
}

SearchBar.contextTypes = {
    router: PropTypes.object
};

export default SearchBar;