import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from "react-router-dom";
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Metrics from '../../globals/Metrics';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import {setFilterState} from '../../actions/setFilterStateAction';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraphContainer from '../common/graphs/LineGraphContainer';
import RetentionMetricsSection from './RetentionMetricsSection';

export class AverageTimeInPlaylistPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${Metrics.AVERAGE_TIME_IN_PLAYLISTS.displayName}`;
        window.scrollTo(0, 0);
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
        $('#average-time-in-playlist-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#average-time-in-playlist-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        if (state.contentType != ContentTypes.PLAYLISTS) {
            this.props.setFilterState(state);
            this.props.history.push(`/analytics/${Metrics.AVERAGE_VIEW_DURATION.name}`);
            return;
        }

        this.setState({isLoading: true});
        this.showLoadingSpinner();

        const metrics = [
            Metrics.AVERAGE_VIEW_DURATION.metric,
            Metrics.AVERAGE_TIME_IN_PLAYLISTS.metric,
            Metrics.VIEWS_PER_PLAYLIST_START.metric
        ];
        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderLineGraph() {
        if (!this.props.averageTimeInPlaylist.columnHeaders) return <div/>;

        return (
            <LineGraphContainer
                dataInfo={this.props.averageTimeInPlaylist}
                xColumnName="day"
                metricInfo={Metrics.AVERAGE_TIME_IN_PLAYLISTS}
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="average-time-in-playlist-page">
                <h2>{Metrics.AVERAGE_TIME_IN_PLAYLISTS.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                <RetentionMetricsSection totalStats={this.props.totalStats} />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

AverageTimeInPlaylistPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    averageTimeInPlaylist: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired,
    history: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;

    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
        
    return {
        averageTimeInPlaylist: state.report,
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
            ((prev.averageTimeInPlaylist !== next.averageTimeInPlaylist) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(withRouter(AverageTimeInPlaylistPage));