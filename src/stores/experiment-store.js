import {EventEmitter} from 'events';
import Graph from 'eg-graph/lib/graph';
import AppDispatcher from '../app-dispatcher';
import cutoff from '../utils/cutoff';

const selectVertex = (graph) => {
  const i = Math.floor(Math.random() * graph.numVertices());
  return graph.vertices()[i];
};

const privates = new WeakMap();

class ExperimentStore extends EventEmitter {
  constructor() {
    super();

    privates.set(this, {
      problemCount: 0,
      correctCount: 0,
      graph: new Graph(),
      query: null
    });

    AppDispatcher.register((payload) => {
      switch (payload.actionType) {
        case 'load-graph':
          this.handleLoadGraph(payload.data);
          break;
        case 'select-vertex':
          this.handleSelectVertex(payload.u);
          break;
      }
    });
  }

  handleLoadGraph(data) {
    const {graph} = privates.get(this);
    for (const {u, d} of data.vertices) {
      graph.addVertex(u, d);
    }
    for (const {u, v, d} of data.edges) {
      graph.addEdge(u, v, d);
    }
    privates.get(this).query = selectVertex(graph);
    this.emit('update');
  }

  handleSelectVertex(u) {
    const {graph} = privates.get(this);
    const v = privates.get(this).query;
    if (u === v) {
      privates.get(this).correctCount += 1;
    }
    privates.get(this).query = selectVertex(graph);
    privates.get(this).problemCount += 1;
    this.emit('update');
  }

  getQuery() {
    const {query, graph} = privates.get(this);
    if (query === null) {
      return null;
    }
    return cutoff(graph.vertex(query).text);
  }

  getProblemCount() {
    return privates.get(this).problemCount;
  }

  getCorrectCount() {
    return privates.get(this).correctCount;
  }

  addUpdateListener(callback) {
    this.on('update', callback);
  }
}

export default new ExperimentStore();
