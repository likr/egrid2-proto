import React from 'react';
import Layouter from 'eg-graph/lib/layouter/sugiyama';
import cutoff from '../utils/cutoff';
import measureText from '../utils/measure-text';
import NetworkDiagramInner from './network-diagram-inner';

const layouter = new Layouter()
  .layerMargin(10)
  .vertexWidth(() => 10)
  .vertexHeight(() => 10)
  .vertexMargin(3)
  .vertexRightMargin(({d}) => d.width)
  .edgeWidth(() => 3)
  .edgeMargin(3);

const calcSizes = (graph) => {
  const sizes = measureText(graph.vertices().map((u) => cutoff(graph.vertex(u).text))),
        result = {};
  graph.vertices().forEach((u, i) => {
    result[u] = sizes[i];
  });
  return result;
};

const sortEdges = (edges) => {
  const priority = (upper, lower) => {
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
    return priority(d1.upper, d1.lower) - priority(d2.upper, d2.lower);
  });
};

const layout = (graph, state) => {
  const sizes = calcSizes(graph);
  for (const u of graph.vertices()) {
    Object.assign(graph.vertex(u), sizes[u]);
  }

  const positions = layouter.layout(graph);

  const vertices = [];
  for (const u of graph.vertices()) {
    const d = graph.vertex(u);
    const {text, selected} = d;
    const {x, y, width, height} = positions.vertices[u];
    const x0 = d.x === null ? x : d.x;
    const y0 = d.y === null ? 0 : d.y;
    vertices.push({
      u, selected, x, y, x0, y0, width, height,
      text: text,
      rightMargin: d.width
    });
  }

  const enterPoints = (u, v) => {
    const uD = graph.vertex(u),
      vD = graph.vertex(v),
      ux0 = uD.x === null ? positions.vertices[u].x : uD.x,
      uy0 = uD.y === null ? 0 : uD.y,
      vx0 = vD.x === null ? positions.vertices[v].x : vD.x,
      vy0 = vD.y === null ? 0 : vD.y;
    return [[ux0, uy0], [ux0, uy0], [vx0, vy0], [vx0, vy0], [vx0, vy0], [vx0, vy0]];
  };
  const edges = [];
  for (const [u, v] of graph.edges()) {
    const d = graph.edge(u, v);
    const {upper, lower} = d;
    const {points, reversed} = positions.edges[u][v];
    while (points.length < 6) {
      points.push(points[points.length - 1]);
    }
    const points0 = d.points === null ? enterPoints(u, v) : d.points;
    edges.push({u, v, points, points0, reversed, upper, lower});
  }
  sortEdges(edges);

  for (const u of graph.vertices()) {
    const {x, y} = positions.vertices[u];
    Object.assign(graph.vertex(u), {x, y});
  }
  for (const [u, v] of graph.edges()) {
    const {points} = positions.edges[u][v];
    Object.assign(graph.edge(u, v), {points});
  }

  return {vertices, edges};
};

const connectedVertices = (graph, u, inverse=false) => {
  const visited = new Set([u]);
  const queue = [u];
  const adjacentVertices = inverse
    ? (v) => graph.inVertices(v)
    : (v) => graph.outVertices(v);
  while (queue.length > 0) {
    const v = queue.shift();
    for (const w of adjacentVertices(v)) {
      if (!visited.has(w)) {
        visited.add(w);
        queue.push(w);
      }
    }
  }
  return visited;
};

const countRelations = (graph, vertices) => {
  const upperCount = new Map(),
    lowerCount = new Map();

  for (const u of vertices) {
    if (graph.vertex(u)) {
      for (const v of connectedVertices(graph, u, true)) {
        if (!upperCount.has(v)) {
          upperCount.set(v, 0);
        }
        upperCount.set(v, upperCount.get(v) + 1);
      }
      for (const v of connectedVertices(graph, u, false)) {
        if (!lowerCount.has(v)) {
          lowerCount.set(v, 0);
        }
        lowerCount.set(v, lowerCount.get(v) + 1);
      }
    }
  }
  return {upperCount, lowerCount};
};

class NetworkDiagramContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: layout(props.graph)
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.graph !== nextProps.graph) {
      return true;
    }
    if (this.props.selection !== nextProps.selection) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.graph !== nextProps.graph) {
      const {upperCount, lowerCount} = countRelations(nextProps.graph, nextProps.selection);
      this.setState({
        layout: layout(nextProps.graph),
        upperCount,
        lowerCount
      });
    }
    if (this.props.selection !== nextProps.selection) {
      const {upperCount, lowerCount} = countRelations(nextProps.graph, nextProps.selection);
      this.setState({
        upperCount,
        lowerCount
      });
    }
  }

  render() {
    return (
      <NetworkDiagramInner
        layout={this.state.layout}
        selection={this.props.selection}
        upperCount={this.state.upperCount}
        lowerCount={this.state.lowerCount}
        toggleSelectVertex={this.props.toggleSelectVertex}/>
    );
  }
}

export default NetworkDiagramContents;
