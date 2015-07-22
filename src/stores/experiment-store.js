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
      started: false,
      finished: false,
      startedTime: null,
      problemCount: 0,
      correctCount: 0,
      graph: new Graph(),
      u: null,
      v: null
    });

    AppDispatcher.register((payload) => {
      switch (payload.actionType) {
        case 'load-graph':
          this.handleLoadGraph(payload.data);
          break;
        case 'guess':
          this.handleGuess(payload.guess);
          break;
        case 'start-experiment':
          this.handleStartExperiment();
          break;
      }
    });
  }

  handleGuess(guess) {
    const attrs = privates.get(this),
          {graph, u, v} = attrs,
          answer = !!(graph.edge(u, v) || graph.edge(v, u));
    if (answer === guess) {
      attrs.correctCount += 1;
    }
    attrs.problemCount += 1;
    attrs.u = selectVertex(attrs.graph);
    if (Math.random() < 0.5) {
      const vs = [].concat(graph.outVertices(attrs.u), graph.inVertices(attrs.u)),
            index = Math.floor(Math.random() * vs.length);
      attrs.v = vs[index];
    } else {
      attrs.v = selectVertex(attrs.graph);
    }
    this.emit('update');
  }

  handleLoadGraph(data) {
    const attrs = privates.get(this),
          graph = attrs.graph;
    for (const {u, d} of data.vertices) {
      graph.addVertex(u, d);
    }
    for (const {u, v, d} of data.edges) {
      graph.addEdge(u, v, d);
    }
    attrs.u = selectVertex(graph);
    if (Math.random() < 0.5) {
      const vs = [].concat(graph.outVertices(attrs.u), graph.inVertices(attrs.u)),
            index = Math.floor(Math.random() * vs.length);
      attrs.v = vs[index];
    } else {
      attrs.v = selectVertex(graph);
    }
    this.emit('update');
  }

  handleStartExperiment() {
    const attrs = privates.get(this);
    attrs.started = true;
    attrs.startedTime = new Date();
    setTimeout(() => {
      attrs.finished = true;
      this.emit('finish');
    }, 100000);
    setInterval(() => {
      this.emit('tick');
    }, 1000);
    this.emit('start');
  }

  getQuery() {
    const {u, v, graph} = privates.get(this);
    if (u === null || v === null) {
      return null;
    }
    return {
      u, v,
      uText: cutoff(graph.vertex(u).text),
      vText: cutoff(graph.vertex(v).text)
    };
  }

  getProblemCount() {
    return privates.get(this).problemCount;
  }

  getCorrectCount() {
    return privates.get(this).correctCount;
  }

  getElapsedTime() {
    return Math.floor((new Date() - privates.get(this).startedTime) / 1000);
  }

  addUpdateListener(callback) {
    this.on('update', callback);
  }

  addStartListener(callback) {
    this.on('start', callback);
  }

  addTickListener(callback) {
    this.on('tick', callback);
  }

  addFinishListener(callback) {
    this.on('finish', callback);
  }
}

export default new ExperimentStore();
