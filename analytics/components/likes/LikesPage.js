import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as likesActions from '../../actions/likesActions';
import * as statsActions from '../../actions/statsActions';
import * as clearActions from '../../actions/clearActions';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';
import LikesMetricsSection from './LikesMetricsSection';

export class LikesPage extends React.PureComponent {
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
        document.title = "Analytics: Likes";
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
    }

    componentWillUnmount() {
        this.props.clearActions.clearLikes();
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
        $('#likes-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#likes-page .loading-spinner').addClass('hidden');
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
        this.props.actions.getLikes(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, 'likes,dislikes', formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The likes metric does not allow filtering by playlist.</div>;
        if (!this.props.likes.columnHeaders) return <div/>;

        return (
            <LineGraph
                dataInfo={this.props.likes}
                xColumnName="day"
                yColumnName="likes"
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="likes-page">
                <h2>Likes</h2>
                <FiltersSection
                    state={this.state}
                    onChangeFilters={this.getData}
                />
                <LikesMetricsSection
                    totalStats={this.props.totalStats}
                    filterState={this.state}
                />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

LikesPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    likes: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.likes
        + state.ajaxCallsInProgress.totalStats;
        
    return {
        likes: state.likes,
        totalStats: state.totalStats,
        isLoading: totalAjaxCallsInProgress > 0
    };
}

export function mapDispatchToProps(dispatch) {
    const combinedActions = Object.assign({}, likesActions, statsActions);
    return {
        actions: bindActionCreators(combinedActions, dispatch),
        clearActions: bindActionCreators(clearActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            ((prev.likes !== next.likes) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(LikesPage);