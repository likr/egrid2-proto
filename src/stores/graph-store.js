import {EventEmitter} from 'events';
import Graph from 'eg-graph/lib/graph';
import Layouter from 'eg-graph/lib/layouter/sugiyama';
import AppDispatcher from '../app-dispatcher';
import cutoff from '../utils/cutoff';
import measureText from '../utils/measure-text';

const layouter = new Layouter()
  .vertexMargin(3)
  .edgeMargin(3);

const findExistingVertex = (graph, text) => {
  for (const u of graph.vertices()) {
    if (graph.vertex(u).text === text) {
      return u;
    }
  }
  return null;
};

const calcSizes = (graph) => {
  const sizes = measureText(graph.vertices().map((u) => cutoff(graph.vertex(u).text))),
        result = {};
  graph.vertices().forEach((u, i) => {
    result[u] = sizes[i];
  });
  return result;
};

const privates = new WeakMap();

const updateLayout = (that) => {
  const {graph, layoutOptions} = privates.get(that),
        {boxLayout, layerMargin} = layoutOptions,
        sizes = calcSizes(graph);

  layouter.layerMargin(layerMargin);
  if (boxLayout) {
    layouter
      .vertexWidth(({u}) => sizes[u].width)
      .vertexHeight(({u}) => sizes[u].height)
      .vertexRightMargin(() => 0)
      .edgeWidth(() => 1);
  } else {
    layouter
      .vertexWidth(() => 10)
      .vertexHeight(() => 10)
      .vertexRightMargin(({u}) => sizes[u].width)
      .edgeWidth(() => 3);
  }

  const positions = layouter.layout(graph),
        positions0 = privates.get(that).positions,
        vertices = graph.vertices().map((u) => {
          const text = cutoff(graph.vertex(u).text),
                {x, y, width, height} = positions.vertices[u],
                rightMargin = layouter.vertexRightMargin()({u}),
                enter = !positions0.vertices[u],
                x0 = enter ? positions.vertices[u].x : positions0.vertices[u].x,
                y0 = enter ? 0 : positions0.vertices[u].y,
                selected = privates.get(that).selected[u] || false;
          return {u, text, x, y, x0, y0, width, height, rightMargin, selected};
        }),
        edges = graph.edges().map(([u, v]) => {
          const reversed = positions.edges[u][v].reversed,
                points = positions.edges[u][v].points,
                upper = privates.get(that).selected[v],
                lower = privates.get(that).selected[u],
                uEnter = !positions0.vertices[u],
                vEnter = !positions0.vertices[v],
                enter = uEnter || vEnter,
                ux0 = uEnter ? positions.vertices[u].x : positions0.vertices[u].x,
                uy0 = uEnter ? 0 : positions0.vertices[u].y,
                vx0 = vEnter ? positions.vertices[v].x : positions0.vertices[v].x,
                vy0 = vEnter ? 0 : positions0.vertices[v].y,
                points0 = enter
                  ? [[ux0, uy0], [ux0, uy0], [vx0, vy0], [vx0, vy0], [vx0, vy0], [vx0, vy0]]
                  : positions0.edges[u][v].points;
          while (points.length < 6) {
            points.push(points[points.length - 1]);
          }
          return {u, v, points, points0, reversed, upper, lower};
        });
  edges.sort((d1, d2) => {
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
    return priority(d1.upper, d1.lower) - priority(d2.upper, d2.lower);
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
  for (const d of layout.edges) {
    d.upper = selected[d.v];
    d.lower = selected[d.u];
  }
  layout.edges.sort((d1, d2) => {
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
    return priority(d1.upper, d1.lower) - priority(d2.upper, d2.lower);
  });
  that.emit('change');
};

class GraphStore extends EventEmitter {
  constructor() {
    super();

    privates.set(this, {
      graph: new Graph(),
      layoutOptions: {
        boxLayout: false,
        layerMargin: 0
      },
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
        case 'add-construct':
          this.handleAddConstruct(payload.text);
          break;
        case 'ladder-down':
          this.handleLadderDown(payload.u, payload.text);
          break;
        case 'ladder-up':
          this.handleLadderUp(payload.u, payload.text);
          break;
        case 'load-graph':
          this.handleLoadGraph(payload.data);
          break;
        case 'remove-selected-constructs':
          this.handleRemoveSelectedConstructs();
          break;
        case 'select-vertex':
          this.handleSelectVertex(payload.u);
          break;
        case 'set-layout-options':
          this.handleSetLayoutOptions(payload.options);
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
    if (v === u) {
      return;
    } else if (v === null) {
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
    if (v === u) {
      return;
    } else if (v === null) {
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

  handleSetLayoutOptions(options) {
    Object.assign(privates.get(this).layoutOptions, options);
    updateLayout(this);
  }

  handleUpdateText(u, text) {
    const {graph} = privates.get(this);
    graph.vertex(u).text = text;
    updateLayout(this);
  }

  getLayout() {
    return privates.get(this).layout;
  }

  getLayerMargin() {
    return privates.get(this).layoutOptions.layerMargin;
  }

  getLayoutType() {
    return privates.get(this).layoutOptions.boxLayout ? 'box' : 'point';
  }

  addChangeListener(callback) {
    this.on('change', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
}

export default new GraphStore();
