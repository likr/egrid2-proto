import {EventEmitter} from 'events';
import Graph from 'eg-graph/lib/graph';
import Layouter from 'eg-graph/lib/layouter/sugiyama';
import AppDispatcher from '../app-dispatcher';

const layouter = new Layouter()
  .layerMargin(150)
  .vertexMargin(10)
  .vertexBottomMargin(() => 30)
  .vertexWidth(() => 10)
  .vertexHeight(() => 10)
  .edgeWidth(() => 1);

const findExistingVertex = (graph, text) => {
  for (const u of graph.vertices()) {
    if (graph.vertex(u).text === text) {
      return u;
    }
  }
  return null;
};

const privates = new WeakMap();

const updateLayout = (that) => {
  const {graph} = privates.get(that),
        positions = layouter.layout(graph),
        positions0 = privates.get(that).positions,
        vertices = graph.vertices().map((u) => {
          const {text} = graph.vertex(u),
                {x, y} = positions.vertices[u],
                enter = !positions0.vertices[u],
                x0 = enter ? 0 : positions0.vertices[u].x,
                y0 = enter ? 0 : positions0.vertices[u].y,
                selected = privates.get(that).selected[u];
          return {u, text, x, y, x0, y0, selected};
        }),
        edges = graph.edges().map(([u, v]) => {
          const reversed = !positions.edges[u][v],
                points = reversed ? positions.edges[v][u].points : positions.edges[u][v].points,
                enter = reversed
                  ? !positions0.edges[v] || !positions0.edges[v][u]
                  : !positions0.edges[u] || !positions0.edges[u][v],
                points0 = enter
                  ? points.map(() => [0, 0])
                  : (reversed ? positions0.edges[v][u].points : positions0.edges[u][v].points);
          return {u, v, points, points0, reversed};
        });
  privates.get(that).layout = {vertices, edges};
  privates.get(that).positions = positions;

  that.emit('change');
};

const updateSelection = (that) => {
  const {selected, layout} = privates.get(that);
  for (const d of layout.vertices) {
    d.selected = selected[d.u];
  }
  that.emit('change');
};

class GraphStore extends EventEmitter {
  constructor() {
    super();

    privates.set(this, {
      graph: new Graph(),
      selected: {},
      positions: {
        vertices: {},
        edges: {}
      },
      layout: {
        vertices: [],
        edges: []
      }
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
        case 'select-vertex':
          this.handleSelectVertex(payload.u);
          break;
        case 'remove-selected-constructs':
          this.handleRemoveSelectedConstructs();
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
    updateLayout(this);
  }

  handleAddConstruct(text) {
    const {graph, selected} = privates.get(this);
    if (findExistingVertex(graph, text) !== null) {
      return;
    }
    const u = graph.addVertex({
      text
    });
    selected[u] = false;
    updateLayout(this);
  }

  handleLadderUp(u, text) {
    const {graph, selected} = privates.get(this);
    const v = findExistingVertex(graph, text);
    if (v === null) {
      const w = graph.addVertex({
        text
      });
      graph.addEdge(w, u);
      selected[w] = false;
    } else {
      graph.addEdge(v, u);
    }
    updateLayout(this);
  }

  handleLadderDown(u, text) {
    const {graph, selected} = privates.get(this);
    const v = findExistingVertex(graph, text);
    if (v === null) {
      const w = graph.addVertex({
        text
      });
      graph.addEdge(u, w);
      selected[w] = false;
    } else {
      graph.addEdge(u, v);
    }
    updateLayout(this);
  }

  handleRemoveSelectedConstructs() {
    const {graph, selected} = privates.get(this);
    for (const u of graph.vertices()) {
      if (selected[u]) {
        graph.removeVertex(u);
      }
    }
    updateLayout(this);
  }

  handleSelectVertex(u) {
    const {selected} = privates.get(this);
    selected[u] = !selected[u];
    updateSelection(this);
  }

  handleUpdateText(u, text) {
    const {graph} = privates.get(this);
    graph.vertex(u).text = text;
    updateLayout(this);
  }

  getLayout() {
    return privates.get(this).layout;
  }

  addChangeListener(callback) {
    this.on('change', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
}

export default new GraphStore();
