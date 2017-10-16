import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import GraphTypes from '../../globals/GraphTypes';
import Metrics from '../../globals/Metrics';
import Regions from '../../globals/Regions';
import computeVideosInPlaylists from '../../helpers/computeVideosInPlaylists';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import {setFilterState} from '../../actions/setFilterStateAction';
import FiltersSection from '../common/filtering/FiltersSection';
import GraphContainer from '../common/graphs/GraphContainer';
import VideosInPlaylistsMetricsSection from './VideosInPlaylistsMetricsSection';

export class VideosInPlaylistsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            metrics: [
                Metrics.VIDEOS_ADDED_TO_PLAYLISTS.metric,
                Metrics.VIDEOS_REMOVED_FROM_PLAYLISTS.metric
            ],
            playlistAttempted: props.filterState.contentType == ContentTypes.PLAYLISTS,
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderGraphContainer = this.renderGraphContainer.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${Metrics.VIDEOS_IN_PLAYLISTS.displayName}`;
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
        $('#videos-in-playlists-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#videos-in-playlists-page .loading-spinner').addClass('hidden');
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
        
        const metrics = this.state.metrics;
        if (this.props.graphType == GraphTypes.LINE) {
            this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        }
        if (this.props.graphType == GraphTypes.GEO) {
            const sort = null;
            const dimensions = 'country';
            this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters, dimensions, sort);
        }
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderGraphContainer() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The videos in playlists metric does not allow filtering by playlist.</div>;
        if (!this.props.videosInPlaylists.columnHeaders)
            return <div/>;

        const videosInPlaylistsInfo = computeVideosInPlaylists(this.props.videosInPlaylists);
        return (
            <GraphContainer
                dataInfo={videosInPlaylistsInfo}
                metrics={this.state.metrics}
                metricInfo={Metrics.VIDEOS_IN_PLAYLISTS}
                onRenderStart={this.showLoadingSpinner}
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="videos-in-playlists-page">
                <h2>{Metrics.VIDEOS_IN_PLAYLISTS.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                <VideosInPlaylistsMetricsSection totalStats={this.props.totalStats} />
                {this.renderGraphContainer()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

VideosInPlaylistsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    videosInPlaylists: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    graphType: PropTypes.string.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;
                
    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
    
    return {
        videosInPlaylists: state.report,
        totalStats: state.totalStats,
        filterState: newFilterStateObject,
        graphType: state.graphType,
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
            ((prev.videosInPlaylists !== next.videosInPlaylists) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(VideosInPlaylistsPage);