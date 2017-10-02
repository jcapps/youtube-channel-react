import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraphContainer from '../common/graphs/LineGraphContainer';
import RetentionMetricsSection from './RetentionMetricsSection';

export class AverageViewDurationPage extends React.PureComponent {
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
        this.state.isLoading = true;

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Average View Duration";
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
        this.setState({...state});
        this.setState({isLoading: true});

        this.showLoadingSpinner();

        let metrics = ['averageViewDuration', 'averageViewPercentage'];
        if (state.contentType == ContentTypes.PLAYLISTS) {
            metrics = ['averageViewDuration', 'averageTimeInPlaylist', 'viewsPerPlaylistStart'];
        }
        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
    }

    renderLineGraph() {
        if (!this.props.averageViewDuration.columnHeaders) return <div/>;

        return (
            <LineGraphContainer
                dataInfo={this.props.averageViewDuration}
                xColumnName="day"
                yColumnName="averageViewDuration"
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
                <h2>Average View Duration</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <RetentionMetricsSection
                    totalStats={this.props.totalStats}
                    filterState={this.state}
                />
                {this.renderLineGraph()}
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
    state: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;
        
    return {
        averageViewDuration: state.report,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch)
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