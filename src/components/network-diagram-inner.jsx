import React from 'react';
import d3scale from 'd3-scale';
import PointVertex from './point-vertex';
import TextLabel from './text-label';
import Edge from './edge';


const vertexColor = d3scale.category20();

const edgeColor = (upper, lower) => {
  if (upper && lower) {
    const l = Math.max(50, 80 - 3 * Math.max(upper, lower));
    return `hsl(300,100%,${l}%)`;
  }
  if (upper) {
    const l = Math.max(50, 80 - 3 * upper);
    return `hsl(0,100%,${l}%)`;
  }
  if (lower) {
    const l = Math.max(50, 80 - 3 * lower);
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
  render() {
    const {layout, selection, upperCount, lowerCount} = this.props;
    const dur = 1, delay = 0.5;

    const vertices = layout.vertices.map((d) => {
      const fillColor = vertexColor(d.community),
            strokeColor = selection.has(d.u) ? '#f00' : '#bbb';
      return (
        <PointVertex
            key={d.u}
            dur={dur}
            delay={delay}
            u={d.u}
            x={d.x}
            y={d.y}
            x0={d.x0}
            y0={d.y0}
            width={d.width}
            height={d.height}
            fillColor={fillColor}
            strokeColor={strokeColor}
            selectVertex={this.props.toggleSelectVertex}/>
      );
    });

    const labels = layout.vertices.map((d) => {
      return (
        <TextLabel
            key={d.u}
            dur={dur}
            delay={delay}
            u={d.u}
            text={d.text}
            x={d.x}
            y={d.y}
            x0={d.x0}
            y0={d.y0}
            textWidth={d.textWidth}
            textHeight={d.textHeight}
            selected={selection.has(d.u)}
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
            dur={dur}
            delay={delay}
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
        <g className="labels">
          {labels}
        </g>
      </g>
    );
  }
}

export default NetworkDiagramInner;
