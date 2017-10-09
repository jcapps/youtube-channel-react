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
import OverviewSection from './OverviewSection';

export class AnalyticsHomePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            contentType: props.filterState.contentType,
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderOverviewSections = this.renderOverviewSections.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
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
        this.setState({
            contentType: state.contentType,
            isLoading: true
        });

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
        this.props.setFilterState(state);
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
                    isLoading={this.state.isLoading}
                    data={this.props.report}
                    metricInfo={metricInfo}
                    totalStats={this.props.totalStats}
                    size={size}
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
                    state={this.props.filterState}
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
    clearActions: PropTypes.object.isRequired,
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats
        
    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
        
    return {
        report: state.report,
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
            !next.isLoading
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(AnalyticsHomePage);