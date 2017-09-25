import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import computeSubscribers from '../../helpers/computeSubscribers';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as subscribersActions from '../../actions/subscribersActions';
import * as statsActions from '../../actions/statsActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';
import SubscribersMetricsSection from './SubscribersMetricsSection';

export class SubscribersPage extends React.PureComponent {
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
        this.state.isLoading = true;

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Subscribers";
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
    }

    componentWillUnmount() {
        this.props.clearActions.clearSubscribers();
        this.props.clearActions.clearUnsubscribers();
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

    showLoadingSpinner() {
        $('#subscribers-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#subscribers-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            return;
        } else {
            this.setState({playlistAttempted: false});
        }

        this.setState({isLoading: true});
        this.showLoadingSpinner();
        this.props.actions.getSubscribers(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getUnsubscribers(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, 'subscribersGained,subscribersLost', formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The subscribers metric does not allow filtering by playlist.</div>;
        if (!this.props.subscribers.columnHeaders || !this.props.unsubscribers.columnHeaders)
            return <div/>;

        const subscribersInfo = computeSubscribers(this.props.subscribers, this.props.unsubscribers);
        return (
            <LineGraph
                dataInfo={subscribersInfo}
                xColumnName="day"
                yColumnName="subscribers"
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="subscribers-page">
                <h2>Subscribers</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <SubscribersMetricsSection
                    totalStats={this.props.totalStats}
                    filterState={this.state}
                />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

SubscribersPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    subscribers: PropTypes.object.isRequired,
    unsubscribers: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.subscribers
        + state.ajaxCallsInProgress.unsubscribers
        + state.ajaxCallsInProgress.totalStats;
        
    return {
        subscribers: state.subscribers,
        unsubscribers: state.unsubscribers,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, subscribersActions, statsActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            ((prev.subscribers !== next.subscribers) &&
            (prev.unsubscribers !== next.unsubscribers) &&
            (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(SubscribersPage);