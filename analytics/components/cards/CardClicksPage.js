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
import LineGraphContainer from '../common/graphs/LineGraphContainer';
import CardsMetricsSection from './CardsMetricsSection';

export class CardClicksPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playlistAttempted: props.filterState.contentType == ContentTypes.PLAYLISTS,
            isLoading: true
        };

        this.getData = this.getData.bind(this);
        this.renderLineGraph = this.renderLineGraph.bind(this);
    }

    componentWillMount() {
        this.getData(this.props.filterState);
    }

    componentDidMount() {
        document.title = `Analytics: ${Metrics.CARD_CLICKS.displayName}`;
        window.scrollTo(0, 0);

        if (this.state.playlistAttempted) this.hideLoadingSpinner();
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
        $('#card-clicks-page .loading-spinner').removeClass('hidden');
    }

    hideLoadingSpinner() {
        $('#card-clicks-page .loading-spinner').addClass('hidden');
    }

    getData(state) {
        if (state.contentType == ContentTypes.PLAYLISTS) {
            this.setState({playlistAttempted: true});
            this.props.clearActions.clearReport();
            this.props.setFilterState(state);
            return;
        } else {
            this.setState({playlistAttempted: false});
        }

        this.setState({isLoading: true});
        this.showLoadingSpinner();
        
        const metrics = [
            Metrics.CARD_CLICKS.metric,
            Metrics.CARD_TEASER_CLICKS.metric,
            Metrics.CARD_CLICK_RATE.metric,
            Metrics.CARD_TEASER_CLICK_RATE.metric
        ];
        this.props.actions.getReport(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.actions.getTotalStats(state.timePeriod, state.dateRange, metrics, state.filters);
        this.props.setFilterState(state);
    }

    renderLineGraph() {
        if (this.state.playlistAttempted)
            return <div className="error-message">The card clicks metric does not allow filtering by playlist.</div>;
        if (!this.props.cardClicks.columnHeaders) return <div/>;

        return (
            <LineGraphContainer
                dataInfo={this.props.cardClicks}
                xColumnName="day"
                metricInfo={Metrics.CARD_CLICKS}
                onRenderFinish={this.hideLoadingSpinner}
                isLoading={this.state.isLoading}
            />
        );
    }

    render() {
        if (this.props.isLoading) return <div/>;

        const loadingSpinner = require('../../images/loading.gif');
        return (
            <div id="card-clicks-page">
                <h2>{Metrics.CARD_CLICKS.displayName}</h2>
                <FiltersSection
                    state={this.props.filterState}
                    onChangeFilters={this.getData}
                />
                <CardsMetricsSection totalStats={this.props.totalStats} />
                {this.renderLineGraph()}
                <img className="loading-spinner" src={loadingSpinner} alt="Loading..." />
            </div>
        );
    }
}

CardClicksPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    cardClicks: PropTypes.object.isRequired,
    totalStats: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    clearActions: PropTypes.object.isRequired,
    filterState: PropTypes.object.isRequired,
    setFilterState: PropTypes.func.isRequired
};

export function mapStateToProps(state) {
    const totalAjaxCallsInProgress
        = state.ajaxCallsInProgress.report
        + state.ajaxCallsInProgress.totalStats;
        
    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
       
    return {
        cardClicks: state.report,
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
            (!next.isLoading) || 
            ((prev.cardClicks !== next.cardClicks) && (prev.totalStats !== next.totalStats))
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(CardClicksPage);