import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import lineGraph from '../../graphs/lineGraph';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import * as viewsActions from '../../actions/viewsActions';
import ContentFilter from './ContentFilter';
import ContentTypeFilter from './ContentTypeFilter';
import TimePeriodFilter from './TimePeriodFilter';

export class ViewsPage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            contentType: ContentTypes.VIDEOS,
            timePeriod: Periods.TWENTY_EIGHT_DAY,
            filters: ''
        };
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
        this.changeContentType = this.changeContentType.bind(this);
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.renderContentTypeFilter = this.renderContentTypeFilter.bind(this);
    }

    componentWillMount() {
        const timePeriod = this.state.timePeriod;
        const filters = this.state.filters;
        this.props.actions.getViews(timePeriod, null, filters);
    }

    componentDidMount() {
        document.title = "Analytics: Views";
        window.scrollTo(0, 0);
    }

    renderLineGraphD3(viewsInfo) {
        const container = d3.select('#views-graph');
        if (!container._groups[0][0]) return;
        container.html('');
        lineGraph(container, viewsInfo, 'day', 'views');
    }

    changeContentType(contentType) {
        const {timePeriod, filters} = this.state;
        let newFilter = '';
        if (contentType == ContentTypes.PLAYLISTS) newFilter = 'isCurated==1;';

        this.setState({
            contentType: contentType,
            filters: newFilter
        });
        this.props.actions.getViews(timePeriod, null, newFilter);
    }

    changeTimePeriod(timePeriod, startEndDates) {
        const filters = this.state.filters;
        if (timePeriod != this.state.timePeriod) {
            this.setState({timePeriod: timePeriod});
            if (timePeriod == Periods.CUSTOM) return;
        }
        this.props.actions.getViews(timePeriod, startEndDates, filters);
    }

    addFilter(searchResult) {
        const kind = searchResult.id.kind;
        let newFilter = '';
        if (kind == 'youtube#video') newFilter = 'video==' + searchResult.id.videoId + ';';
        if (kind == 'youtube#playlist') newFilter = 'isCurated==1;playlist==' + searchResult.id.playlistId + ';';

        const {timePeriod, filters} = this.state;
        this.setState({filters: newFilter}); // TODO: Needs to handle previously set filters
        this.props.actions.getViews(timePeriod, null, newFilter);
    }

    renderContentTypeFilter() {
        const shouldHideContentTypeFilter = 
            this.state.filters.indexOf('video==') > -1 || 
            this.state.filters.indexOf('playlist==') > -1;
        if (!shouldHideContentTypeFilter) {
            return (
                <ContentTypeFilter
                    changeContentType={this.changeContentType}
                    contentType={this.state.contentType}
                />
            );
        }
        return;
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);

        return (
            <div id="views-page">
                <h2>Views</h2>
                <div id="filters">
                    <ContentFilter addFilter={this.addFilter}/>
                    {this.renderContentTypeFilter()}
                    <TimePeriodFilter
                        changeTimePeriod={this.changeTimePeriod}
                        timePeriod={this.state.timePeriod}
                    />
                </div>
                <div id="views-graph" />
            </div>
        );
    }
}

ViewsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    views: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        views: state.views,
        isLoading: state.ajaxCallsInProgress.views > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewsActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.views !== next.views)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ViewsPage);