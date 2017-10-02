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

    showLoadingSpinner(dataType) {
        $(`#${dataType}-overview-section .loading-spinner`).removeClass('hidden');
    }

    hideLoadingSpinner(dataType) {
        $(`#${dataType}-overview-section .loading-spinner`).addClass('hidden');
    }

    hideAllLoadingSpinners() {
        let dataTypes = [
            'comments',
            'likes',
            'dislikes',
            'shares',
            'subscribers',
            'subscribersGained',
            'subscribersLost',
            'views',
            'watchTime',
            'revenue',
            'adRevenue',
            'youtubeRedRevenue'
        ];
        if (this.state.contentType == ContentTypes.PLAYLISTS) {
            dataTypes = ['views', 'watchTime', 'playlistStarts'];
        }
        dataTypes.forEach(dataType => {
            this.hideLoadingSpinner(dataType);
        });
    }

    getData(state) {
        this.setState({...state});
        this.setState({isLoading: true});

        let metrics = [
            'comments',
            'likes',
            'dislikes',
            'shares',
            'subscribersGained',
            'subscribersLost',
            'views',
            'averageViewDuration',
            'estimatedMinutesWatched',
            'estimatedRevenue',
            'estimatedAdRevenue',
            'estimatedRedPartnerRevenue'
        ];
        let dataTypes = [
            'comments',
            'likes',
            'dislikes',
            'shares',
            'subscribers',
            'subscribersGained',
            'subscribersLost',
            'views',
            'averageViewDuration',
            'watchTime',
            'revenue',
            'adRevenue',
            'youtubeRedRevenue'
        ];
        if (state.contentType == ContentTypes.PLAYLISTS) {
            metrics = [
                'views',
                'estimatedMinutesWatched',
                'averageViewDuration',
                'playlistStarts'
            ];
            dataTypes = [
                'views',
                'watchTime',
                'averageViewDuration',
                'playlistStarts'
            ];
        }

        dataTypes.forEach((dataType, i) => {
            this.showLoadingSpinner(dataType);
        });

        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
    }

    renderOverviewSections() {
        let dataTypes;
        if (this.state.contentType == ContentTypes.PLAYLISTS) {
            dataTypes = [ // Order matters in determining layout
                'views',
                'watchTime',
                'averageViewDuration',
                'playlistStarts'
            ];
        } else {
            dataTypes = [ // Order matters in determining layout
                'views',
                'watchTime',
                'averageViewDuration',
                'revenue',
                'likes',
                'dislikes',
                'comments',
                'shares',
                'subscribers',
                'subscribersGained',
                'subscribersLost',
                'adRevenue',
                'youtubeRedRevenue'
            ];
        }

        let sectionsArray = [];
        dataTypes.forEach((dataType, i) => {
            let size = 'small';
            if (i < 4) size = 'medium';
            sectionsArray.push(
                <OverviewSection
                    key={dataType}
                    data={this.props.report}
                    dataType={dataType}
                    totalStats={this.props.totalStats}
                    size={size}
                    state={this.state}
                    onRenderFinish={() => this.hideLoadingSpinner(dataType)}
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