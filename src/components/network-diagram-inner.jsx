import React from 'react';
import mixin from 'react-mixin';
import Animate from '../react-animate';
import PointVertex from './point-vertex';
import Edge from './edge';

const edgeColor = (upper, lower) => {
  if (upper && lower) {
    const l = Math.max(30, 100 - 10 * Math.max(upper, lower));
    return `hsl(300,100%,${l}%)`;
  }
  if (upper) {
    const l = Math.max(30, 100 - 10 * upper);
    return `hsl(0,100%,${l}%)`;
  }
  if (lower) {
    const l = Math.max(30, 100 - 10 * lower);
    return `hsl(240,100%,${l}%)`;
  }
  return '#bbb';
};

class NetworkDiagramInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      t: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.layout !== nextProps.layout) {
      this.setState({
        t: 0
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.layout !== prevProps.layout) {
      this.animate({
        t: 1
      }, 1000);
    }
  }

  render() {
    const {layout} = this.props,
      {t} = this.state;

    const vertices = layout.vertices.map((d) => {
      const color = d.selected ? 'red' : 'black';
      return (
        <PointVertex
            key={d.u}
            u={d.u}
            text={d.text}
            t={t}
            x={d.x}
            y={d.y}
            x0={d.x0}
            y0={d.y0}
            color={color}
            selectVertex={this.props.toggleSelectVertex}/>
      );
    });
    const edges = layout.edges.map((d) => {
      const color = edgeColor(d.upper, d.lower);
      return (
        <Edge
            key={`${d.u}:${d.v}`}
            t={t}
            points={d.points}
            points0={d.points0}
            reversed={d.reversed}
            edgeWidth="3"
            color={color}/>
      );
    });
    return (
      <g>
        <g className="edges">
          {edges}
        </g>
        <g className="vertices">
          {vertices}
        </g>
      </g>
    );
  }
}

mixin(NetworkDiagramInner.prototype, Animate);

export default NetworkDiagramInner;
