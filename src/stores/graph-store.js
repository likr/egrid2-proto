import {EventEmitter} from 'events';
import Graph from 'eg-graph/lib/graph';
import AppDispatcher from '../app-dispatcher';

const findExistingVertex = (graph, text) => {
  for (const u of graph.vertices()) {
    if (graph.vertex(u).text === text) {
      return u;
    }
  }
  return null;
};

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
        case 'ladder-up':
          this.handleLadderUp(payload.u, payload.text);
          break;
        case 'ladder-down':
          this.handleLadderDown(payload.u, payload.text);
          break;
        case 'update-text':
          this.handleUpdateText(payload.u, payload.text);
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
    if (findExistingVertex(graph, text) !== null) {
      return;
    }
    graph.addVertex({
      text
    });
    this.emit('change');
  }

  handleLadderUp(u, text) {
    const {graph} = privates.get(this);
    const v = findExistingVertex(graph, text);
    if (v === null) {
      const w = graph.addVertex({
        text
      });
      graph.addEdge(w, u);
    } else {
      graph.addEdge(v, u);
    }
    this.emit('change');
  }

  handleLadderDown(u, text) {
    const {graph} = privates.get(this);
    const v = findExistingVertex(graph, text);
    if (v === null) {
      const w = graph.addVertex({
        text
      });
      graph.addEdge(u, w);
    } else {
      graph.addEdge(u, v);
    }
    this.emit('change');
  }

  handleUpdateText(u, text) {
    const {graph} = privates.get(this);
    graph.vertex(u).text = text;
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
