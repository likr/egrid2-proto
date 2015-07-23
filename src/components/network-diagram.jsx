import React from 'react';
import mixin from 'react-mixin';
import Graph from 'eg-graph/lib/graph';
import Animate from '../react-animate';
import GraphStore from '../stores/graph-store';
import PointVertex from './point-vertex';
import BoxVertex from './box-vertex';
import Edge from './edge';

const totalWidth = (layout) => {
  let left = 0, right = 0;
  for (const vertex of layout.vertices) {
    left = Math.min(left, vertex.x - vertex.width / 2);
    right = Math.max(right, vertex.x + vertex.width / 2 + vertex.rightMargin);
  }
  return right - left;
};

const edgeColor = (upper, lower, boxLayout) => {
  if (boxLayout) {
    if (upper && lower) {
      return '#800080';
    }
    if (upper) {
      return '#0000ff';
    }
    if (lower) {
      return '#ff0000';
    }
    return '#000000';
  } else {
    if (upper && lower) {
      return '#dda0dd';
    }
    if (upper) {
      return '#00bfff';
    }
    if (lower) {
      return '#ffc0cb';
    }
    return '#bbb';
  }
};

class NetworkDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 1,
      x0: 0,
      y0: 0,
      draggin: false,
      zoomX: 0,
      zoomY: 0,
      zoomScale: 1
    };
  }

  componentDidMount() {
    const screenWidth = React.findDOMNode(this).parentNode.clientWidth;
    this.setState({
      zoomScale: screenWidth / totalWidth(this.props.layout)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.layout !== nextProps.layout) {
      const screenWidth = React.findDOMNode(this).parentNode.clientWidth;
      this.setState({
        zoomScale: screenWidth / totalWidth(nextProps.layout)
      });
    }
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

  onMouseMove(e) {
    const {clientX, clientY} = e;
    this.dragMove(clientX, clientY);
    e.preventDefault();
  }

  onTouchStart({touches}) {
    const {clientX, clientY} = touches[0];
    this.dragStart(clientX, clientY);
  }

  onTouchEnd() {
    this.dragEnd();
  }

  onTouchMove(e) {
    const {clientX, clientY} = e.touches[0];
    this.dragMove(clientX, clientY);
    e.preventDefault();
  }

  onWheel(e) {
    const {clientX, clientY, deltaY} = e,
          zoomFactor = 0.9,
          scale = Math.max(0.1, Math.min(2, deltaY < 0
            ? this.state.zoomScale / zoomFactor
            : this.state.zoomScale * zoomFactor));
    this.setState({
      zoomX: clientX - scale / this.state.zoomScale * (clientX - this.state.zoomX),
      zoomY: clientY - scale / this.state.zoomScale * (clientY - this.state.zoomY),
      zoomScale: scale
    });
    e.preventDefault();
  }

  render() {
    const {layout} = this.props,
          {t} = this.state,
          boxLayout = GraphStore.getLayoutType() === 'box';
    const vertices = layout.vertices.map((d) => {
      const color = (d.u === this.props.u || d.u === this.props.v) ? 'red' : 'black';
      if (boxLayout) {
        return (
          <BoxVertex
              key={d.u}
              u={d.u}
              text={d.text}
              t={t}
              x={d.x}
              y={d.y}
              x0={d.x0}
              y0={d.y0}
              width={d.width}
              height={d.height}
              color={color}/>
        );
      } else {
        return (
          <PointVertex
              key={d.u}
              u={d.u}
              text={d.text}
              t={t}
              x={d.x}
              y={d.y}
              x0={d.x0}
              y0={d.y0}
              color={color}/>
        );
      }
    });
    const edges = layout.edges.map((d) => {
      const color = edgeColor(d.upper, d.lower, boxLayout),
            edgeWidth = boxLayout ? 1 : 3;
      return (
        <Edge
            key={`${d.u}:${d.v}`}
            t={t}
            points={d.points}
            points0={d.points0}
            reversed={d.reversed}
            edgeWidth={edgeWidth}
            color={color}/>
      );
    });

    const svgTransform = `translate(${this.state.zoomX},${this.state.zoomY})scale(${this.state.zoomScale})`;
    const svgStyle = {
      cursor: 'move'
    };
    return (
      <svg width="100%" height="100%"
          style={svgStyle}>
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

mixin(NetworkDiagram.prototype, Animate);

export default NetworkDiagram;
