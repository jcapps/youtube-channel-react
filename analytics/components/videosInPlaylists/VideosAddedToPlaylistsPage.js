import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Metrics from '../../globals/Metrics';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import {setFilterState} from '../../actions/setFilterStateAction';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraphContainer from '../common/graphs/LineGraphContainer';
import VideosInPlaylistsMetricsSection from './VideosInPlaylistsMetricsSection';

export class VideosAddedToPlaylistsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playlistAttempted: props.filterState.contentType == ContentTypes.PLAYLISTS,
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${Metrics.VIDEOS_ADDED_TO_PLAYLISTS.displayName}`;
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
    }

    componentWillUnmount() {
        this.props.clearActions.clearReport();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps)) {
            this.setState({isLoading: false});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps) || 
            JSON.stringify(this.state) != JSON.stringify(nextState)) {
            return true;
        }
        this.hideLoadingSpinner();
        return false;
    }

    showLoadingSpinner() {
        $('#videos-added-to-playlists-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#videos-added-to-playlists-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            this.props.clearActions.clearReport();
            this.props.setFilterState(state);
            return;
        } else {
            this.setState({playlistAttempted: false});
        }

        this.setState({isLoading: true});
        this.showLoadingSpinner();
        
        const metrics = [
            Metrics.VIDEOS_ADDED_TO_PLAYLISTS.metric,
            Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.metric
        ];
        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The videos added to playlists metric does not allow filtering by playlist.</div>;
        if (!this.props.videosAddedToPlaylists.columnHeaders) return <div/>;

        return (
            <LineGraphContainer
                dataInfo={this.props.videosAddedToPlaylists}
                xColumnName="day"
                metricInfo={Metrics.VIDEOS_ADDED_TO_PLAYLISTS}
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="videos-added-to-playlists-page">
                <h2>{Metrics.VIDEOS_ADDED_TO_PLAYLISTS.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                <VideosInPlaylistsMetricsSection totalStats={this.props.totalStats} />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

VideosAddedToPlaylistsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    videosAddedToPlaylists: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;
        
    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
    
    return {
        videosAddedToPlaylists: state.report,
        totalStats: state.totalStats,
        filterState: newFilterStateObject,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch),
        setFilterState: bindActionCreators(setFilterState, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            ((prev.videosAddedToPlaylists !== next.videosAddedToPlaylists) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(VideosAddedToPlaylistsPage);