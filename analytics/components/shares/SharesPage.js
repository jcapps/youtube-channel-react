import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as sharesActions from '../../actions/sharesActions';
import * as statsActions from '../../actions/statsActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';
import SharesMetricsSection from './SharesMetricsSection';

export class SharesPage extends React.PureComponent {
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
        document.title = "Analytics: Shares";
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
    }

    componentWillUnmount() {
        this.props.clearActions.clearShares();
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
        $('#shares-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#shares-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            this.props.clearActions.clearShares();
            return;
        } else {
            this.setState({playlistAttempted: false});
        }

        this.setState({isLoading: true});
        this.showLoadingSpinner();
        this.props.actions.getShares(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, 'shares', formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The shares metric does not allow filtering by playlist.</div>;
        if (!this.props.shares.columnHeaders) return <div/>;

        return (
            <LineGraph
                dataInfo={this.props.shares}
                xColumnName="day"
                yColumnName="shares"
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="shares-page">
                <h2>Shares</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <SharesMetricsSection
                    totalStats={this.props.totalStats}
                    filterState={this.state}
                />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

SharesPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    shares: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.shares
        + state.ajaxCallsInProgress.totalStats;
        
    return {
        shares: state.shares,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, sharesActions, statsActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            ((prev.shares !== next.shares) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(SharesPage);