import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as viewsActions from '../../actions/viewsActions';
import {clearViews} from '../../actions/clearAction';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';

export class ViewsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        if (props.location.state) {
            this.state = props.location.state;
        } else {
            this.state = {
                contentType: ContentTypes.ALL,
                timePeriod: Periods.TWENTY_EIGHT_DAY,
                dateRange: null,
                filters: [],
                addedFilters: []
            };
        }
        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Views";
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        this.props.clearViews();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.props.isLoading != nextProps.isLoading ||
            this.props.views !== nextProps.views ||
            this.props.totalStats !== nextProps.totalStats ||
            (this.state.timePeriod !== nextState.timePeriod && nextState.timePeriod == Periods.CUSTOM)
        ) {
            return true;
        }
        return false;
    }

    showLoadingSpinner() {
        $('#views-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#views-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({...state});

        this.showLoadingSpinner();
        this.props.actions.getViews(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (!this.props.views.columnHeaders) return <div/>;

        return (
            <LineGraph
                dataInfo={this.props.views}
                xColumnName="day"
                yColumnName="views"
                onRenderFinish={this.hideLoadingSpinner}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        let totalViews = 0;
        let totalEstimatedMinutesWatched = 0;
        const totalStats = this.props.totalStats;
        if (totalStats.columnHeaders) {
            const totalStatsColumns = totalStats.columnHeaders.map(item => {
                return item.name;
            });
            if (totalStats.rows) {
                totalViews = totalStats.rows[0][totalStatsColumns.indexOf('views')];
                totalEstimatedMinutesWatched = totalStats.rows[0][totalStatsColumns.indexOf('estimatedMinutesWatched')];
            } else {
                totalViews = 0;
                totalEstimatedMinutesWatched = 0;
            }
        }

        return (
            <div id="views-page">
                <h2>Views</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <h4>Total Views: {totalViews.toLocaleString()}</h4>
                <h4>Total Estimated Minutes Watched: {totalEstimatedMinutesWatched.toLocaleString()}</h4>
                <Link to={{pathname: "/analytics/watchTime", state: this.state}}><div>Switch to Watch Time</div></Link>
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

ViewsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    views: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearViews: PropTypes.func.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    return {
        views: state.views,
        totalStats: state.totalStats,
        isLoading: state.ajaxCallsInProgress.views > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewsActions, dispatch),
        clearViews: bindActionCreators(clearViews, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.views !== next.views) || 
            (prev.totalStats !== next.totalStats)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ViewsPage);