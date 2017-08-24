import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import Periods from '../../globals/Periods';
import * as viewsActions from '../../actions/viewsActions';

export class ViewsPage extends React.PureComponent {
    constructor() {
        super();
        this.renderLineGraphD3 = this.renderLineGraphD3.bind(this);
    }

    componentWillMount() {
        this.props.actions.getViews();
    }

    componentDidMount() {
        document.title = "Analytics: Views";
        window.scrollTo(0, 0);
    }

    renderLineGraphD3(viewsInfo) {
        const svg = d3.select("svg");
        if (!svg._groups[0][0]) return;
        
        const margin = {top: 20, right: 20, bottom: 30, left: 50};
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        const parseTime = d3.timeParse("%Y-%m-%d");
        
        const x = d3.scaleTime()
            .rangeRound([0, width]);
        
        const y = d3.scaleLinear()
            .rangeRound([height, 0]);
        
        const line = d3.line()
            .x(d => { return x(d.get('day')); })
            .y(d => { return y(d.get('views')); });

        const columns = viewsInfo.columnHeaders.map(item => {
            return item.name;
        });
        const data = viewsInfo.rows;
        data.forEach((item, i) => {
            data[i] = d3.map(item, (d, i) => {
                return columns[i];
            });
            const dataEntry = data[i];
            dataEntry.set('day', parseTime(dataEntry.get('day')));
        });

        x.domain(d3.extent(data, d => { return d.get('day'); })).nice();
        y.domain([0, d3.max(data, d => { return d.get('views'); })]).nice();
        
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        g.append("g")
            .call(d3.axisLeft(y));
            
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);
        return (
            <div id="views-page">
                <h2>Views</h2>
                <svg id="views-graph" width="960" height="500" />
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