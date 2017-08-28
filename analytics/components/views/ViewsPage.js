import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import lineGraph from '../../graphs/lineGraph';
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
        const container = d3.select("#views-graph");
        if (!container._groups[0][0]) return;
        lineGraph(container, viewsInfo, 'day', 'views');
    }

    render() {
        if (this.props.isLoading) return <div/>;
        if (this.props.views.columnHeaders) this.renderLineGraphD3(this.props.views);
        return (
            <div id="views-page">
                <h2>Views</h2>
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