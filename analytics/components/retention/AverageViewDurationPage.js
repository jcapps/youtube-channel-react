import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import GraphTypes from '../../globals/GraphTypes';
import Metrics from '../../globals/Metrics';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import {setFilterState} from '../../actions/setFilterStateAction';
import FiltersSection from '../common/filtering/FiltersSection';
import GraphContainer from '../common/graphs/GraphContainer';
import RetentionMetricsSection from './RetentionMetricsSection';

export class AverageViewDurationPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            metrics: [],
            nonPlaylistMetrics: [
                Metrics.AVERAGE_VIEW_DURATION.metric,
                Metrics.AVERAGE_VIEW_PERCENTAGE.metric
            ],
            playlistMetrics: [
                Metrics.AVERAGE_VIEW_DURATION.metric,
                Metrics.AVERAGE_TIME_IN_PLAYLISTS.metric,
                Metrics.VIEWS_PER_PLAYLIST_START.metric
            ],
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderGraphContainer = this.renderGraphContainer.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${Metrics.AVERAGE_VIEW_DURATION.displayName}`;
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
        $('#average-view-duration-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#average-view-duration-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({isLoading: true});
        this.showLoadingSpinner();

        let metrics = this.state.nonPlaylistMetrics;
        if (state.contentType == ContentTypes.PLAYLISTS) {
            metrics = this.state.playlistMetrics;
        }
        this.setState({metrics: metrics});

        if (this.props.graphType == GraphTypes.LINE) {
            this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        }
        if (this.props.graphType == GraphTypes.GEO) {
            const sort = '-' + Metrics.AVERAGE_VIEW_DURATION.metric;
            let dimensions = 'country';
            for (let i = 0; i < state.filters.length; i++) {
                if (state.filters[i].key == 'country' && state.filters[i].value == 'US') {
                    dimensions = 'province';
                }
            }
            this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters, dimensions, sort);
        }
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderGraphContainer() {
        if (!this.props.averageViewDuration.columnHeaders) return <div/>;

        return (
            <GraphContainer
                dataInfo={this.props.averageViewDuration}
                metrics={this.state.metrics}
                metricInfo={Metrics.AVERAGE_VIEW_DURATION}
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
            <div id="average-view-duration-page">
                <h2>{Metrics.AVERAGE_VIEW_DURATION.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                <RetentionMetricsSection totalStats={this.props.totalStats} />
                {this.renderGraphContainer()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

AverageViewDurationPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    averageViewDuration: PropTypes.object.isRequired,
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
        averageViewDuration: state.report,
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
            ((prev.averageViewDuration !== next.averageViewDuration) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AverageViewDurationPage);