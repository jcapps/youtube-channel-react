import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import countries from 'world-countries';
import GraphTypes from '../../../globals/GraphTypes';
import retrieveCountryInfo from '../../../helpers/retrieveCountryInfo';
import sortDataByCustomColumn from '../../../helpers/sortDataByCustomColumn';
import * as reportActions from '../../../actions/reportActions';
import {setGraphType} from '../../../actions/setGraphTypeAction';
import GeoMapContainer from './GeoMapContainer';
import LineGraphContainer from './LineGraphContainer';

class GraphContainer extends React.PureComponent {
    constructor() {
        super();

        this.switchToGeoMapContainer = this.switchToGeoMapContainer.bind(this);
        this.switchToLineGraphContainer = this.switchToLineGraphContainer.bind(this);
    }

    switchToGeoMapContainer() {
        this.props.onRenderStart();
        const {
            timePeriod,
            dateRange,
            filters
        } = this.props.filterState;

        let sort = null;
        if (this.props.metricInfo.metric) {
            sort = '-' + this.props.metricInfo.metric;
        }

        let dimensions = 'country';
        for (let i = 0; i < filters.length; i++) {
            if (
                filters[i].key == 'country' && 
                filters[i].value == 'US' &&
                this.props.metricInfo.canShowUSStates
            ) {
                dimensions = 'province';
            }
        }

        this.props.actions.getReport(timePeriod, dateRange, this.props.metrics, filters, dimensions, sort);
        this.props.setGraphType(GraphTypes.GEO);
    }
    
    switchToLineGraphContainer() {
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
        let dataInfo = this.props.dataInfo;
        if (!dataInfo.columnHeaders) return <div/>;

        let dataArea = 'country';
        const columns = dataInfo.columnHeaders.map(item => {
            return item.name;
        });
        if (columns.indexOf('province') > -1) {
            dataArea = 'province';
        }
        
        let region = {name: {common: 'World'}};
        const filters = this.props.filterState.filters;
        for (let i = 0; i < filters.length; i++) {
            if (filters[i].key == 'country') {
                if (filters[i].value != '') {
                    region = retrieveCountryInfo(filters[i].value);
                }
            }
        }

        if (this.props.graphType == GraphTypes.GEO) {
            if (!this.props.metricInfo.metric) {
                dataInfo = sortDataByCustomColumn(dataInfo, this.props.metricInfo.name);
            }

            return (
                <GeoMapContainer
                    dataArea={dataArea}
                    dataInfo={dataInfo}
                    metricInfo={this.props.metricInfo}
                    region={region}
                    onRenderFinish={this.props.onRenderFinish}
                    onChangeFilters={this.props.onChangeFilters}
                    filterState={this.props.filterState}
                    isLoading={this.props.isLoading}
                />
            );
        }

        if (this.props.graphType == GraphTypes.LINE) {
            return (
                <LineGraphContainer
                    dataInfo={dataInfo}
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
                        <div onClick={this.switchToLineGraphContainer}>Line Graph</div>
                    </li>
                    <li>
                        <div onClick={this.switchToGeoMapContainer}>Geo Map</div>
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
    onChangeFilters: PropTypes.func.isRequired,
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