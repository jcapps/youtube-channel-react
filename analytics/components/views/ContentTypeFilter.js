import React from 'react';
import PropTypes from 'prop-types';
import ContentTypes from '../../globals/ContentTypes';

class ContentTypeFilter extends React.PureComponent {
    constructor() {
        super();
        this.changeContentType = this.changeContentType.bind(this);
    }
    
    changeContentType(e) {
        const contentType = e.target.value;
        this.props.changeContentType(contentType);
    }

    render() {
        return (
            <div id="content-type-filter">
                <select className="views-select" value={this.props.contentType} onChange={this.changeContentType}>
                    <option value={ContentTypes.VIDEOS}>Videos</option>
                    <option value={ContentTypes.PLAYLISTS}>Playlists</option>
                </select>
            </div>
        );
    }
}

ContentTypeFilter.propTypes = {
    changeContentType: PropTypes.func.isRequired,
    contentType: PropTypes.string.isRequired
};

export default ContentTypeFilter;