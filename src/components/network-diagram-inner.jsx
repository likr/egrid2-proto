import React from 'react';
import mixin from 'react-mixin';
import Animate from '../react-animate';
import PointVertex from './point-vertex';
import Edge from './edge';

const edgeColor = (upper, lower) => {
  if (upper && lower) {
    const l = Math.max(50, 100 - 5 * Math.max(upper, lower));
    return `hsl(300,100%,${l}%)`;
  }
  if (upper) {
    const l = Math.max(50, 100 - 5 * upper);
    return `hsl(0,100%,${l}%)`;
  }
  if (lower) {
    const l = Math.max(40, 100 - 10 * lower);
    return `hsl(240,100%,${l}%)`;
  }
  return '#ddd';
};

const sortEdges = (edges, upperCount, lowerCount) => {
  const priority = (u, v) => {
    const upper = upperCount.has(u) && upperCount.has(v) ? Math.min(upperCount.get(u), upperCount.get(v)) : 0,
      lower = lowerCount.has(u) && lowerCount.has(v) ? Math.min(lowerCount.get(u), lowerCount.get(v)) : 0;
    if (upper && lower) {
      return 3;
    }
    if (upper) {
      return 2;
    }
    if (lower) {
      return 1;
    }
    return 0;
  };
  edges.sort((d1, d2) => {
    return priority(d1.u, d1.v) - priority(d2.u, d2.v);
  });
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
    const {layout, selection, upperCount, lowerCount} = this.props,
      {t} = this.state;

    const vertices = layout.vertices.map((d) => {
      const color = selection.has(d.u) ? 'red' : 'black';
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
            width={d.width}
            height={d.height}
            color={color}
            selectVertex={this.props.toggleSelectVertex}/>
      );
    });

    sortEdges(layout.edges, upperCount, lowerCount);
    const edges = layout.edges.map((d) => {
      const {u, v} = d,
        upper = upperCount.has(u) && upperCount.has(v) ? Math.min(upperCount.get(u), upperCount.get(v)) : 0,
        lower = lowerCount.has(u) && lowerCount.has(v) ? Math.min(lowerCount.get(u), lowerCount.get(v)) : 0,
        color = edgeColor(upper, lower);
      return (
        <Edge
            key={`${u}:${v}`}
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
