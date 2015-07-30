import Graph from 'eg-graph/lib/graph';
import transformer from 'eg-graph/lib/transformer';
import katz from 'eg-graph/lib/network/centrality/katz';
import {
  LOAD_GRAPH,
  SET_COARSE_GRAINING_RATIO
} from '../constants';

class CoarseGrainingTransformer extends transformer.CoarseGrainingTransformer {
  constructor() {
    super();
    this.ratio = 0;
  }
}

const copyTransformer = new transformer.CopyTransformer();
const coarseGrainingTransformer = new CoarseGrainingTransformer()
  .vertexVisibility(({d}) => d.order >= coarseGrainingTransformer.ratio);
const ismTransform = new transformer.IsmTransformer();
const pipeTransformer = new transformer
  .PipeTransformer(copyTransformer, coarseGrainingTransformer, ismTransform);

const transform = (graph) => {
  const transformed = pipeTransformer.transform(graph);
  for (const u of graph.vertices()) {
    if (!transformed.vertex(u)) {
      Object.assign(graph.vertex(u), {
        x: null,
        y: null
      });
    }
  }
  for (const [u, v] of graph.edges()) {
    if (graph.edge(u, v) !== transformed.edge(u, v)) {
      Object.assign(graph.edge(u, v), {
        points: null
      });
    }
  }
  for (const [u, v] of transformed.edges()) {
    if (!transformed.edge(u, v).points) {
      transformed.edge(u, v).points = null;
    }
  }
  return transformed;
};

const handleLoadGraph = (graph, data) => {
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
  const centrality = katz(graph);
  const vertices = graph.vertices();
  vertices.sort((u, v) => centrality[u] - centrality[v]);
  let order = 0;
  let currentValue = centrality[vertices[0]];
  for (let i = 0; i < graph.numVertices(); ++i) {
    const u = vertices[i];
    if (centrality[u] !== currentValue) {
      order = i;
      currentValue = centrality[u];
    }
    graph.vertex(u).order = (order + 1) / graph.numVertices();
  }
  const minCentrality = centrality[vertices[0]],
    maxCentrality = centrality[vertices[vertices.length - 1]];
  for (const u of vertices) {
    graph.vertex(u).centrality = (centrality[u] - minCentrality) / (maxCentrality - minCentrality);
  }
  return transform(graph);
};

const handleSetCoarseGrainingRatio = (graph, ratio) => {
  coarseGrainingTransformer.ratio = ratio;
  return transform(graph);
};

const graph = new Graph();

const graphStore = (state=graph, action) => {
  switch (action.type) {
    case LOAD_GRAPH:
      return handleLoadGraph(graph, action.data);
    case SET_COARSE_GRAINING_RATIO:
      return handleSetCoarseGrainingRatio(graph, action.ratio);
    default:
      return state;
  }
};

export default graphStore;
