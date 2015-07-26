import Graph from 'eg-graph/lib/graph';
import Layouter from 'eg-graph/lib/layouter/sugiyama';
import {LOAD_GRAPH, SELECT_VERTICES, UNSELECT_VERTICES, TOGGLE_SELECT_VERTEX} from '../constants';
import cutoff from '../utils/cutoff';
import measureText from '../utils/measure-text';

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
    const y0 = d.y === null ? y : d.y;
    vertices.push({
      u, selected, x, y, x0, y0, width, height,
      text: cutoff(text),
      rightMargin: d.width
    });
  }

  const enterPoints = (u, v) => {
    const uD = graph.vertex(u),
      vD = graph.vertex(v),
      ux0 = uD === null ? positions.vertices[u].x : uD.x,
      uy0 = uD === null ? 0 : uD.y,
      vx0 = vD === null ? positions.vertices[v].x : vD.x,
      vy0 = vD === null ? 0 : vD.y;
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

const handleLoadGraph = (state, graph, data) => {
  for (const {u, d} of data.vertices) {
    graph.addVertex(u, Object.assign({
      x: null,
      y: null,
      selected: false
    }, d));
  }
  for (const {u, v, d} of data.edges) {
    graph.addEdge(u, v, Object.assign({
      points: null,
      upper: 0,
      lower: 0
    }, d));
  }
  return layout(graph, state);
};

const handleSelectVertices = (state, graph, vertices) => {
  return state;
};

const handleToggleSelectVertex = (state, graph, u) => {
  const selected = !graph.vertex(u).selected;
  graph.vertex(u).selected = selected;
  const vertices = state.vertices.map((d) => {
    if (d.u === u) {
      return Object.assign({}, d, {selected});
    }
    return d;
  });
  const edges = state.edges.map((d) => {
    if (d.u === u) {
      const lower = graph.edge(d.u, d.v).lower + (selected ? 1 : -1);
      graph.edge(d.u, d.v).lower = lower;
      return Object.assign({}, d, {lower});
    }
    if (d.v === u) {
      const upper = graph.edge(d.u, d.v).upper + (selected ? 1 : -1);
      graph.edge(d.u, d.v).upper = upper;
      return Object.assign({}, d, {upper});
    }
    return d;
  });
  sortEdges(edges);
  return {vertices, edges};
};

const handleUnselectVertices = (state, graph, vertices) => {
  return state;
};

let graph = new Graph();

const graphStore = (state=null, action) => {
  if (state === null) {
    state = {
      vertices: [],
      edges: []
    };
  }

  switch (action.type) {
    case LOAD_GRAPH:
      return handleLoadGraph(state, graph, action.data);
    case SELECT_VERTICES:
      return handleSelectVertices(state, graph, action.vertices);
    case TOGGLE_SELECT_VERTEX:
      return handleToggleSelectVertex(state, graph, action.u);
    case UNSELECT_VERTICES:
      return handleUnselectVertices(state, graph, action.vertices);
    default:
      return state;
  }
};

export default graphStore;
