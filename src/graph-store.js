import {EventEmitter} from 'events';
import Graph from 'eg-graph/lib/graph';
import AppDispatcher from './app-dispatcher';

const privates = new WeakMap();

class GraphStore extends EventEmitter {
  constructor() {
    super();

    privates.set(this, {
      graph: new Graph()
    });

    AppDispatcher.register((payload) => {
      switch (payload.actionType) {
        case 'load-graph':
          this.handleLoadGraph(payload.data);
          break;
        case 'add-construct':
          this.handleAddConstruct(payload.text);
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
    this.emit('change');
  }

  handleAddConstruct(text) {
    const {graph} = privates.get(this);
    graph.addVertex({
      text
    });
    this.emit('change');
  }

  getGraph() {
    return privates.get(this).graph;
  }

  addChangeListener(callback) {
    this.on('change', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
}

export default new GraphStore();
