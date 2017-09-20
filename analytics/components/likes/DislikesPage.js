import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from 'jquery';
import ContentTypes from '../../globals/ContentTypes';
import Periods from '../../globals/Periods';
import formatFiltersString from '../../helpers/formatFiltersString';
import * as dislikesActions from '../../actions/dislikesActions';
import {clearDislikes} from '../../actions/clearAction';
import FiltersSection from '../common/filtering/FiltersSection';
import LineGraph from '../common/graphs/LineGraph';
import LikesMetricsSection from './LikesMetricsSection';

export class DislikesPage extends React.PureComponent {
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

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.state);
    }

    componentDidMount() {
        document.title = "Analytics: Dislikes";
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
    }

    componentWillUnmount() {
        this.props.clearDislikes();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.props.isLoading != nextProps.isLoading ||
            this.props.likes !== nextProps.likes ||
            this.props.totalStats !== nextProps.totalStats ||
            this.state.playlistAttempted != nextState.playlistAttempted ||
            (this.state.timePeriod !== nextState.timePeriod && nextState.timePeriod == Periods.CUSTOM)
        ) {
            return true;
        }
        return false;
    }

    showLoadingSpinner() {
        $('#dislikes-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#dislikes-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        this.setState({...state});
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            return;
        } else {
            this.setState({playlistAttempted: false});
        }

        this.showLoadingSpinner();
        this.props.actions.getDislikes(state.timePeriod, state.dateRange, formatFiltersString(state.filters));
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">Sorry, you can't filter by playlist.</div>;
        if (!this.props.dislikes.columnHeaders) return <div/>;

        return (
            <LineGraph
                dataInfo={this.props.dislikes}
                xColumnName="day"
                yColumnName="dislikes"
                onRenderFinish={this.hideLoadingSpinner}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="dislikes-page">
                <h2>Dislikes</h2>
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

DislikesPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dislikes: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearDislikes: PropTypes.func.isRequired,
    state: PropTypes.object
};

export function mapStateToProps(state) {
    return {
        dislikes: state.dislikes,
        totalStats: state.totalStats,
        isLoading: state.ajaxCallsInProgress.dislikes > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dislikesActions, dispatch),
        clearDislikes: bindActionCreators(clearDislikes, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || 
            (prev.dislikes !== next.dislikes) || 
            (prev.totalStats !== next.totalStats)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(DislikesPage);