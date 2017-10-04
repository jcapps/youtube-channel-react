import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Metrics from '../../globals/Metrics';
import Periods from '../../globals/Periods';
import * as reportActions from '../../actions/reportActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import OverviewSection from './OverviewSection';

export class AnalyticsHomePage extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            contentType: ContentTypes.ALL,
            timePeriod: Periods.TWENTY_EIGHT_DAY,
            dateRange: null,
            filters: [],
            addedFilters: []
        };
        this.state.isLoading = true;

        this.getData = this.getData.bind(this);
        this.renderOverviewSections = this.renderOverviewSections.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Home";
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
        this.hideAllLoadingSpinners();
        return false;
    }

    showLoadingSpinner(dataName) {
        $(`#${dataName}-overview-section .loading-spinner`).removeClass('hidden');
    }

    hideLoadingSpinner(dataName) {
        $(`#${dataName}-overview-section .loading-spinner`).addClass('hidden');
    }

    hideAllLoadingSpinners() {
        $.each(Metrics, (i, metricEntry) => {
            if (this.state.contentType == ContentTypes.PLAYLISTS) {
                if (metricEntry.isPlaylistMetric) {
                    this.hideLoadingSpinner(metricEntry.name);
                }
            } else {
                if (metricEntry.isVideoMetric) {
                    this.hideLoadingSpinner(metricEntry.name);
                }
            }
        });
    }

    getData(state) {
        this.setState({...state});
        this.setState({isLoading: true});

        const metrics = [];
        const dataNames = [];
        $.each(Metrics, (key, metricEntry) => {
            if (state.contentType == ContentTypes.PLAYLISTS) {
                if (metricEntry.isPlaylistMetric) {
                    if (metricEntry.metric) metrics.push(metricEntry.metric);
                    dataNames.push(metricEntry.name);
                }
            } else {
                if (metricEntry.isVideoMetric) {
                    if (metricEntry.metric) metrics.push(metricEntry.metric);
                    dataNames.push(metricEntry.name);
                }
            }
        });

        dataNames.forEach((dataName, i) => {
            this.showLoadingSpinner(dataName);
        });

        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
    }

    renderOverviewSections() {
        // Order matters in determining layout
        let metricInfos = [];
        $.each(Metrics, (key, metricEntry) => {
            if (this.state.contentType == ContentTypes.PLAYLISTS) {
                if (metricEntry.isPlaylistMetric) {
                    metricInfos.push(metricEntry);
                }
            } else {
                if (metricEntry.isVideoMetric) {
                    metricInfos.push(metricEntry);
                }
            }
        });

        let sectionsArray = [];
        metricInfos.forEach((metricInfo, i) => {
            let size = 'small';
            if (i < 4) size = 'medium';
            sectionsArray.push(
                <OverviewSection
                    key={metricInfo.name}
                    data={this.props.report}
                    metricInfo={metricInfo}
                    totalStats={this.props.totalStats}
                    size={size}
                    state={this.state}
                    onRenderFinish={() => this.hideLoadingSpinner(metricInfo.name)}
                />
            );
        });

        return sectionsArray;
    }

    render() {
        return (
            <div id="analytics-home-page">
                <h2>YouTube Analytics Overview</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <div id="overview-sections">
                    {this.renderOverviewSections()}
                </div>
            </div>
        );
    }
}

AnalyticsHomePage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    report: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats

    return {
        report: state.report,
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
            !next.isLoading
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AnalyticsHomePage);