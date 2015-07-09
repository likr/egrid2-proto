import React from 'react';
import Graph from 'eg-graph/lib/graph';
import Layouter from 'eg-graph/lib/layouter/sugiyama';
import Vertex from './vertex';
import Edge from './edge';

const layouter = new Layouter()
  .layerMargin(100)
  .vertexMargin(20)
  .vertexWidth(() => 10)
  .vertexHeight(() => 10)
  .edgeWidth(() => 1);

class NetworkDiagram extends React.Component {
  constructor(props) {
    super(props);

    const graph = new Graph();
    for (const {u, d} of props.data.vertices) {
      graph.addVertex(u, d);
    }
    for (const {u, v, d} of props.data.edges) {
      graph.addEdge(u, v, d);
    }

    this.state = {
      zoomX: 10,
      zoomY: 10,
      zoomScale: 1,
      graph,
      positions: layouter.layout(graph)
    };
  }

  componentWillReceiveProps(props) {
    const graph = new Graph();
    for (const {u, d} of props.data.vertices) {
      graph.addVertex(u, d);
    }
    for (const {u, v, d} of props.data.edges) {
      graph.addEdge(u, v, d);
    }

    this.setState({
      graph,
      positions: layouter.layout(graph)
    });
  }

  onMouseDown(e) {
    this.x0 = e.clientX;
    this.y0 = e.clientY;
  }

  onMouseMove(e) {
    if (e.buttons > 0) {
      const dx = e.clientX - this.x0,
            dy = e.clientY - this.y0;
      this.x0 = e.clientX;
      this.y0 = e.clientY;
      this.setState({
        zoomX: this.state.zoomX + dx,
        zoomY: this.state.zoomY + dy
      });
    }
  }

  onWheel({deltaY}) {
    const zoomFactor = 0.95;
    if (deltaY > 0) {
      this.setState({
        zoomScale: this.state.zoomScale / zoomFactor
      });
    } else {
      this.setState({
        zoomScale: this.state.zoomScale * zoomFactor
      });
    }
  }

  render() {
    const {graph, positions} = this.state;
    const vertices = graph.vertices().map((u) => {
      return <Vertex key={u} d={graph.vertex(u)} position={positions.vertices[u]}/>;
    });
    const edges = graph.edges().map(([u, v]) => {
      return <Edge key={`${u}:${v}`} points={positions.edges[u][v].points}/>;
    });

    const svgTransform = `translate(${this.state.zoomX},${this.state.zoomY})scale(${this.state.zoomScale})`;
    const svgStyle = {
      cursor: 'move'
    };
    return (
      <svg width="100%" height="100%"
          style={svgStyle}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onWheel={this.onWheel.bind(this)}>
        <g className="contents" transform={svgTransform}>
          <g className="edges">
            {edges}
          </g>
          <g className="vertices">
            {vertices}
          </g>
        </g>
      </svg>
    );
  }
}

export default NetworkDiagram;
