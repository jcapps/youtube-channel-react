import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as aggregateActions from '../../actions/aggregateActions';
import * as statsActions from '../../actions/statsActions';
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
        this.props.clearActions.clearAggregatePlaylist();
        this.props.clearActions.clearAggregateVideo();
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

    showLoadingSpinner(dataType) {
        $(`#${dataType}-overview-section .loading-spinner`).removeClass('hidden');
    }

    hideLoadingSpinner(dataType) {
        $(`#${dataType}-overview-section .loading-spinner`).addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        this.setState({isLoading: true});

        let dataTypes = [
            'comments',
            'likes',
            'dislikes',
            'shares',
            'subscribers',
            'subscribersGained',
            'subscribersLost',
            'views',
            'estimatedMinutesWatched',
            'estimatedRevenue',
            'estimatedAdRevenue',
            'estimatedRedPartnerRevenue'
        ];
        if (state.contentType == ContentTypes.PLAYLISTS) {
            dataTypes = ['views', 'estimatedMinutesWatched'];
        }

        const newDataTypes = Object.assign([], dataTypes);

        dataTypes.forEach((dataType, i) => {
            if (dataType == 'estimatedMinutesWatched') {
                this.showLoadingSpinner('watchTime');
                return;
            }
            if (dataType == 'estimatedRevenue') {
                this.showLoadingSpinner('revenue');
                return;
            }
            if (dataType == 'estimatedAdRevenue') {
                this.showLoadingSpinner('adRevenue');
                return;
            }
            if (dataType == 'estimatedRedPartnerRevenue') {
                this.showLoadingSpinner('youtubeRedRevenue');
                return;
            }
            if (dataType == 'subscribers') {
                this.showLoadingSpinner('subscribers');
                newDataTypes.splice(i, 1);
                return;
            }
            this.showLoadingSpinner(dataType);
        });

        dataTypes = newDataTypes;
        const metrics = dataTypes.join(',');

        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.props.actions.getAggregatePlaylist(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        } else {
            this.props.actions.getAggregateVideo(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        }
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, formatFiltersString(state.filters));
    }

    renderOverviewSections() {
        let data;
        let dataTypes;
        if (this.state.contentType == ContentTypes.PLAYLISTS) {
            data = this.props.aggregate.playlist;
            dataTypes = [ // Order matters in determining layout
                'views',
                'watchTime'
            ];
        } else {
            data = this.props.aggregate.video;
            dataTypes = [ // Order matters in determining layout
                'views',
                'watchTime',
                'likes',
                'dislikes',
                'comments',
                'shares',
                'subscribers',
                'subscribersGained',
                'subscribersLost',
                'revenue',
                'adRevenue',
                'youtubeRedRevenue'
            ];
        }

        let sectionsArray = [];
        dataTypes.forEach(dataType => {
            let size = 'small';
            if (dataType == 'views' || dataType == 'watchTime' || dataType == 'likes' || dataType == 'dislikes') {
                size = 'medium';
            }
            sectionsArray.push(
                <OverviewSection
                    key={dataType}
                    data={data}
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
        if (this.props.isLoading) return <div/>;
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
    aggregate: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.aggregate.playlist
        + state.ajaxCallsInProgress.aggregate.video
        + state.ajaxCallsInProgress.totalStats

    return {
        aggregate: state.aggregate,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign(
        {},
        aggregateActions,
        statsActions
    );
    return {
        actions: bindActionCreators(combinedActions, dispatch),
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