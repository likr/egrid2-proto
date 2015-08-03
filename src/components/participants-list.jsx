import React from 'react';
import {connect} from 'redux/react';
import d3scale from 'd3-scale';
import {selectVertices} from '../actions/graph-actions';
import clustering from '../utils/clustering';

@connect((state) => ({
  graph: state.graph,
  participants: state.participants,
  selection: state.selection
}))
class ParticipantsList extends React.Component {
  render() {
    const {participants, graph} = this.props;
    const data = participants.map((participant) => {
      return new Set(graph.vertices().filter((u) => {
        return graph.vertex(u).participants.indexOf(participant) > -1;
      }));
    });
    const cluster = clustering(data);
    const xScale = d3scale.linear()
      .domain([0, Math.max(...cluster.vertices().map((u) => cluster.vertex(u).x))])
      .range([250, 0]);
    const vertices = cluster.vertices().map((u) => {
      const {x, y, indices} = cluster.vertex(u);
      const selected = Array.from(this.props.selection).some((v) => {
        return graph.vertex(v) && indices.every((i) => {
          return graph.vertex(v).participants.indexOf(participants[i]) > -1;
        });
      });
      const color = selected ? '#f00' : '#000';
      return (
        <g
            key={u}
            style={{cursor: 'pointer'}}
            transform={`translate(${xScale(x)},${y})`}
            onClick={this.handleClickNode.bind(this, indices)}>
          <circle
              fill={color}
              r="5"/>
          <text
              fill={color}
              x="7"
              y="5"
              fontSize="10pt">
            {indices.length === 1 ? participants[indices[0]] : ''}
          </text>
        </g>
      );
    });
    const edges = cluster.edges().map(([u, v]) => {
      const x1 = xScale(cluster.vertex(u).x);
      const y1 = cluster.vertex(u).y;
      const x2 = xScale(cluster.vertex(v).x);
      const y2 = cluster.vertex(v).y;
      const d = `M${x1},${y1} L${x1},${y2} L${x2},${y2}`;
      return (
        <path key={`${u}:${v}`} d={d} stroke="black" fill="none"/>
      );
    });

    return (
      <div>
        <h3>Participants</h3>
        <svg style={{background: 'white'}} width="100%" height="400px">
          <g transform="translate(10,50)">
            {edges}
            {vertices}
          </g>
        </svg>
      </div>
    );
  }

  handleClickNode(indices) {
    const graph = this.props.graph;
    const participants = indices.map((i) => this.props.participants[i]);
    const vertices = graph.vertices().filter((u) => {
      return participants.every((p) => graph.vertex(u).participants.indexOf(p) > -1);
    });
    this.props.dispatch(selectVertices(vertices));
  }
}

export default ParticipantsList;
