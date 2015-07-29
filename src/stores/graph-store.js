import Graph from 'eg-graph/lib/graph';
import transformer from 'eg-graph/lib/transformer';
import katz from 'eg-graph/lib/network/centrality/katz';
import {
  // CLEAR_SELECTION,
  LOAD_GRAPH,
  SET_COARSE_GRAINING_RATIO
  // SELECT_VERTICES,
  // SELECT_VERTICES_BY_PARTICIPANT,
  // UNSELECT_VERTICES,
  // TOGGLE_SELECT_VERTEX
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

// const connectedVertices = (graph, u, inverse=false) => {
//   const visited = new Set([u]);
//   const queue = [u];
//   const adjacentVertices = inverse
//     ? (v) => graph.inVertices(v)
//     : (v) => graph.outVertices(v);
//   while (queue.length > 0) {
//     const v = queue.shift();
//     for (const w of adjacentVertices(v)) {
//       if (!visited.has(w)) {
//         visited.add(w);
//         queue.push(w);
//       }
//     }
//   }
//   return visited;
// };

// const selectVertices = (state, graph, us, selected=false) => {
//   const verticesSet = new Set(us),
//     upperCount = new Map(),
//     lowerCount = new Map();
//
//   for (const u of us) {
//     if (graph.vertex(u).selected === selected) {
//       graph.vertex(u).selected = !selected;
//       for (const v of connectedVertices(graph, u, true)) {
//         if (!upperCount.has(v)) {
//           upperCount.set(v, 0);
//         }
//         upperCount.set(v, upperCount.get(v) + 1);
//       }
//       for (const v of connectedVertices(graph, u, false)) {
//         if (!lowerCount.has(v)) {
//           lowerCount.set(v, 0);
//         }
//         lowerCount.set(v, lowerCount.get(v) + 1);
//       }
//     }
//   }
//
//   const vertices = state.vertices.map((d) => {
//     if (verticesSet.has(d.u)) {
//       return Object.assign({}, d, {selected: !selected});
//     }
//     return d;
//   });
//   const edges = state.edges.map((d) => {
//     if (upperCount.has(d.u) && upperCount.has(d.v) && lowerCount.has(d.u) && lowerCount.has(d.v)) {
//       const upper = graph.edge(d.u, d.v).upper + (selected ? -1 : 1) * Math.min(upperCount.get(d.u), upperCount.get(d.v)),
//         lower = graph.edge(d.u, d.v).lower + (selected ? -1 : 1) * Math.min(lowerCount.get(d.u), lowerCount.get(d.v));
//       graph.edge(d.u, d.v).upper = upper;
//       graph.edge(d.u, d.v).lower = lower;
//       return Object.assign({}, d, {upper, lower});
//     }
//     if (upperCount.has(d.u) && upperCount.has(d.v)) {
//       const upper = graph.edge(d.u, d.v).upper + (selected ? -1 : 1) * Math.min(upperCount.get(d.u), upperCount.get(d.v));
//       graph.edge(d.u, d.v).upper = upper;
//       return Object.assign({}, d, {upper});
//     }
//     if (lowerCount.has(d.u) && lowerCount.has(d.v)) {
//       const lower = graph.edge(d.u, d.v).lower + (selected ? -1 : 1) * Math.min(lowerCount.get(d.u), lowerCount.get(d.v));
//       graph.edge(d.u, d.v).lower = lower;
//       return Object.assign({}, d, {lower});
//     }
//     return d;
//   });
//   sortEdges(edges);
//   return {vertices, edges};
// };
//
// const handleClearSelection = (state, graph) => {
//   const vertices = graph.vertices().filter((u) => graph.vertex(u).selected);
//   return selectVertices(state, graph, vertices, true);
// };

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
  return transform(graph);
};

const handleSetCoarseGrainingRatio = (graph, ratio) => {
  coarseGrainingTransformer.ratio = ratio;
  return transform(graph);
};

// const handleSelectVertices = (state, vertices) => {
//   return selectVertices(state, vertices);
// };
//
// const handleSelectVerticesByParticipant = (state, participant) => {
//   const vertices = state.graph.vertices().filter((u) => state.graph.vertex(u).participants.indexOf(participant) > -1);
//   return selectVertices(state, vertices);
// };
//
// const handleToggleSelectVertex = (state, u) => {
//   return selectVertices(state, [u], state.graph.vertex(u).selected);
// };
//
// const handleUnselectVertices = (state, vertices) => {
//   return selectVertices(state, vertices, true);
// };

const graph = new Graph();

const graphStore = (state=graph, action) => {
  switch (action.type) {
    // case CLEAR_SELECTION:
    //   return handleClearSelection(state);
    case LOAD_GRAPH:
      return handleLoadGraph(graph, action.data);
    case SET_COARSE_GRAINING_RATIO:
      return handleSetCoarseGrainingRatio(graph, action.ratio);
    // case SELECT_VERTICES:
    //   return handleSelectVertices(state, action.vertices);
    // case SELECT_VERTICES_BY_PARTICIPANT:
    //   return handleSelectVerticesByParticipant(state, action.participant);
    // case TOGGLE_SELECT_VERTEX:
    //   return handleToggleSelectVertex(state, action.u);
    // case UNSELECT_VERTICES:
    //   return handleUnselectVertices(state, action.vertices);
    default:
      return state;
  }
};

export default graphStore;
