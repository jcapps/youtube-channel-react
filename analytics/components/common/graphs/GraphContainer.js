import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import GraphTypes from '../../../globals/GraphTypes';
import Regions from '../../../globals/Regions';
import * as reportActions from '../../../actions/reportActions';
import {setGraphType} from '../../../actions/setGraphTypeAction';
import GeoMapContainer from './GeoMapContainer';
import LineGraphContainer from './LineGraphContainer';

class GraphContainer extends React.PureComponent {
    constructor() {
        super();

        this.renderGeoMapContainer = this.renderGeoMapContainer.bind(this);
        this.renderLineGraphContainer = this.renderLineGraphContainer.bind(this);
    }

    renderGeoMapContainer() {
        this.props.onRenderStart();
        const {
            timePeriod,
            dateRange,
            filters
        } = this.props.filterState;

        const sort = '-' + this.props.metricInfo.metric;

        let dimensions = 'country';
        for (let i = 0; i < filters.length; i++) {
            if (filters[i].key == 'country' && filters[i].value == Regions.UNITED_STATES.twoLetterCountryCode) {
                dimensions = 'province';
            }
        }

        this.props.actions.getReport(timePeriod, dateRange, this.props.metrics, filters, dimensions, sort);
        this.props.setGraphType(GraphTypes.GEO);
    }
    
    renderLineGraphContainer() {
        this.props.onRenderStart();
        const {
            timePeriod,
            dateRange,
            filters
        } = this.props.filterState;

        this.props.actions.getReport(timePeriod, dateRange, this.props.metrics, filters);
        this.props.setGraphType(GraphTypes.LINE);
    }

    renderContainer() {
        if (!this.props.dataInfo.columnHeaders) return <div/>;

        let dataArea = 'country';
        const columns = this.props.dataInfo.columnHeaders.map(item => {
            return item.name;
        });
        if (columns.indexOf('province') > -1) {
            dataArea = 'province';
        }

        if (this.props.graphType == GraphTypes.GEO) {
            return (
                <GeoMapContainer
                    dataArea={dataArea}
                    dataInfo={this.props.dataInfo}
                    metricInfo={this.props.metricInfo}
                    onRenderFinish={this.props.onRenderFinish}
                    isLoading={this.props.isLoading}
                />
            );
        }

        if (this.props.graphType == GraphTypes.LINE) {
            return (
                <LineGraphContainer
                    dataInfo={this.props.dataInfo}
                    xColumnName="day"
                    metricInfo={this.props.metricInfo}
                    onRenderFinish={this.props.onRenderFinish}
                    isLoading={this.props.isLoading}
                />
            );
        }
    }

    render() {
        return (
            <div id="graph-container">
                <ul id="graph-type-list">
                    <li>
                        <div onClick={this.renderLineGraphContainer}>Line Graph</div>
                    </li>
                    <li>
                        <div onClick={this.renderGeoMapContainer}>Geo Map</div>
                    </li>
                </ul>
                {this.renderContainer()}
            </div>
        );
    }
}

GraphContainer.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dataInfo: PropTypes.object.isRequired,
    metrics: PropTypes.array.isRequired,
    metricInfo: PropTypes.object.isRequired,
    onRenderStart: PropTypes.func.isRequired,
    onRenderFinish: PropTypes.func.isRequired,
    filterState: PropTypes.object.isRequired,
    graphType: PropTypes.string.isRequired,
    setGraphType: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

export function mapStateToProps(state) {
    const newFilterStateObject = JSON.parse(JSON.stringify(state.filterState));
    
    return {
        filterState: newFilterStateObject,
        graphType: state.graphType,
        isLoading: state.ajaxCallsInProgress.report > 0
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(reportActions, dispatch),
        setGraphType: bindActionCreators(setGraphType, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphContainer);