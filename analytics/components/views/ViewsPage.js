import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import $ from 'jquery';
import lineGraph from '../../graphs/lineGraph';
import Periods from '../../globals/Periods';
import * as viewsActions from '../../actions/viewsActions';

export class ViewsPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectType: Periods.TWENTY_EIGHT_DAY
        };
        this.changeSelectType = this.changeSelectType.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
    }

    componentWillMount() {
        this.props.actions.getViews();
    }

    componentDidMount() {
        document.title = "Analytics: Views";
        window.scrollTo(0, 0);
    }

    changeSelectType(e) {
        const selectType = e.target.value;
        this.setState({ selectType: selectType });
        if (selectType == Periods.CUSTOM) {
            $('#select-custom-range').removeClass('hidden');
        } else {
            $('#select-custom-range').addClass('hidden');
            this.props.actions.getViews(selectType);
        }
    }

    setDateRange() {
        const startDate = $('#start-date').val();
        const endDate = $('#end-date').val();
        this.props.actions.getViews(Periods.CUSTOM, {startDate, endDate});
    }

    renderLineGraphD3(viewsInfo) {
        const container = d3.select('#views-graph');
        if (!container._groups[0][0]) return;
        container.html('');
        lineGraph(container, viewsInfo, 'day', 'views');
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);
        return (
            <div id="views-page">
                <h2>Views</h2>
                <select className="views-select" value={this.state.selectType} onChange={this.changeSelectType}>
                    <option value={Periods.SEVEN_DAY}>Last 7 Days</option>
                    <option value={Periods.TWENTY_EIGHT_DAY}>Last 28 Days</option>
                    <option value={Periods.THIRTY_DAY}>Last 30 Days</option>
                    <option value={Periods.YEAR}>Last 365 Days</option>
                    <option value={Periods.LIFETIME}>Lifetime</option>
                    <option value={Periods.CUSTOM}>Custom range...</option>
                </select>
                <div id="select-custom-range" className="hidden">
                    <input id="start-date" type="date" />
                    <input id="end-date" type="date" />
                    <button onClick={this.setDateRange}>Go</button>
                </div>
                <div id="views-graph" />
            </div>
        );
    }
}

ViewsPage.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    views: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    return {
        views: state.views,
        isLoading: state.ajaxCallsInProgress.views > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(viewsActions, dispatch)
    };
}

export const connectOptions = {
    areStatePropsEqual: (next, prev) => {
        return !(
            (!next.isLoading) || (prev.views !== next.views)
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps, null, connectOptions)(ViewsPage);