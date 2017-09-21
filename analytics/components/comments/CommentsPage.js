import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as commentsActions from '../../actions/commentsActions';
import {clearComments} from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';
import CommentsMetricsSection from './CommentsMetricsSection';

export class CommentsPage extends React.PureComponent {
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
        this.state.playlistAttempted = this.state.contentType == ContentTypes.PLAYLISTS;

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Comments";
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
    }

    componentWillUnmount() {
        this.props.clearComments();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        return false;
    }

    showLoadingSpinner() {
        $('#comments-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#comments-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            return;
        } else {
            this.setState({playlistAttempted: false});
        }

        this.showLoadingSpinner();
        this.props.actions.getComments(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The comments metric does not allow filtering by playlist.</div>;
        if (!this.props.comments.columnHeaders) return <div/>;

        return (
            <LineGraph
                dataInfo={this.props.comments}
                xColumnName="day"
                yColumnName="comments"
                onRenderFinish={this.hideLoadingSpinner}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="comments-page">
                <h2>Comments</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <CommentsMetricsSection
                    totalStats={this.props.totalStats}
                    filterState={this.state}
                />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

CommentsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    comments: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearComments: PropTypes.func.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    return {
        comments: state.comments,
        totalStats: state.totalStats,
        isLoading: state.ajaxCallsInProgress.comments > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(commentsActions, dispatch),
        clearComments: bindActionCreators(clearComments, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.comments !== next.comments) || 
            (prev.totalStats !== next.totalStats)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(CommentsPage);