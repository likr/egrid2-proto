import React from 'react';
import Graph from 'eg-graph/lib/graph';
import Layouter from 'eg-graph/lib/layouter/sugiyama';
import Vertex from './vertex';
import Edge from './edge';

const layouter = new Layouter()
  .layerMargin(150)
  .vertexMargin(80)
  .vertexWidth(() => 10)
  .vertexHeight(() => 10)
  .edgeWidth(() => 1);

class NetworkDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x0: 0,
      y0: 0,
      draggin: false,
      zoomX: 50,
      zoomY: 50,
      zoomScale: 1,
      graph: props.graph,
      positions: layouter.layout(props.graph)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      graph: props.graph,
      positions: layouter.layout(props.graph)
    });
  }

  dragStart(x, y) {
    this.setState({
      x0: x,
      y0: y,
      dragging: true
    });
  }

  dragEnd() {
    this.setState({
      dragging: false
    });
  }

  dragMove(x, y) {
    if (this.state.dragging) {
      const dx = x - this.state.x0,
            dy = y - this.state.y0;
      this.setState({
        x0: x,
        y0: y,
        zoomX: this.state.zoomX + dx,
        zoomY: this.state.zoomY + dy
      });
    }
  }

  onMouseDown({clientX, clientY}) {
    this.dragStart(clientX, clientY);
  }

  onMouseUp() {
    this.dragEnd();
  }

  onMouseMove({clientX, clientY}) {
    this.dragMove(clientX, clientY);
  }

  onTouchStart({touches}) {
    const {clientX, clientY} = touches[0];
    this.dragStart(clientX, clientY);
  }

  onTouchEnd() {
    this.dragEnd();
  }

  onTouchMove({touches}) {
    const {clientX, clientY} = touches[0];
    this.dragMove(clientX, clientY);
  }

  onWheel({clientX, clientY, deltaY, target}) {
    const zoomFactor = 0.9,
          scale = Math.max(0.1, Math.min(2, deltaY > 0
            ? this.state.zoomScale / zoomFactor
            : this.state.zoomScale * zoomFactor));
    this.setState({
      zoomX: clientX - scale / this.state.zoomScale * (clientX - this.state.zoomX),
      zoomY: clientY - scale / this.state.zoomScale * (clientY - this.state.zoomY),
      zoomScale: scale
    });
  }

  render() {
    const {graph, positions} = this.state;
    const vertices = graph.vertices().map((u) => {
      return <Vertex key={u} u={u} d={graph.vertex(u)} position={positions.vertices[u]}/>;
    });
    const edges = graph.edges().map(([u, v]) => {
      return <Edge key={`${u}:${v}`} u={u} v={v} points={positions.edges[u][v].points}/>;
    });

    const svgTransform = `translate(${this.state.zoomX},${this.state.zoomY})scale(${this.state.zoomScale})`;
    const svgStyle = {
      cursor: 'move'
    };
    return (
      <svg width="100%" height="100%"
          style={svgStyle}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onTouchStart={this.onTouchStart.bind(this)}
          onTouchEnd={this.onTouchEnd.bind(this)}
          onTouchMove={this.onTouchMove.bind(this)}
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
