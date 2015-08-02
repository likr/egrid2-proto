import Cluster from 'hierarchical-clustering';
import Graph from 'eg-graph/lib/graph';

const clustering = (data) => {
  const graph = new Graph();
  if (data.length === 0) {
    return graph;
  }

  const cluster = new Cluster({
    input: data,
    distance: (d1, d2) => {
      let count = 0;
      for (const v of d1) {
        if (d2.has(v)) {
          count += 1;
        }
      }
      return d1.size + d2.size - 2 * count;
    },
    linkage: 'complete'
  });

  const vertices = {};
  cluster[cluster.length - 1].clusters[0].forEach((u, i) => {
    vertices[u] = graph.addVertex({
      indices: [u],
      x: 0,
      y: 20 * i
    });
  });
  for (let i = 1; i < cluster.length; ++i) {
    const {linkage, from, to} = cluster[i];
    const vFrom = cluster[i - 1].clusters[from].join(':');
    const vTo = cluster[i - 1].clusters[to].join(':');
    const u = `${vTo}:${vFrom}`;
    vertices[u] = graph.addVertex({
      indices: [].concat(cluster[i - 1].clusters[from], cluster[i - 1].clusters[to]),
      x: linkage,
      y: (graph.vertex(vertices[vFrom]).y + graph.vertex(vertices[vTo]).y) / 2
    });
    graph.addEdge(vertices[u], vertices[vFrom]);
    graph.addEdge(vertices[u], vertices[vTo]);
  }

  return graph;
};

export default clustering;
