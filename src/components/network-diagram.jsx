import React from 'react';
import mixin from 'react-mixin';
import Animate from '../react-animate';
import PointVertex from './point-vertex';
import Edge from './edge';

const edgeColor = (upper, lower) => {
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
      zoomScale: 0.5
    };
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

  handleMouseDown({clientX, clientY}) {
    this.dragStart(clientX, clientY);
  }

  handleMouseUp() {
    this.dragEnd();
  }

  handleMouseMove(e) {
    const {clientX, clientY} = e;
    this.dragMove(clientX, clientY);
    e.preventDefault();
  }

  handleTouchStart({touches}) {
    const {clientX, clientY} = touches[0];
    this.dragStart(clientX, clientY);
  }

  handleTouchEnd() {
    this.dragEnd();
  }

  handleTouchMove(e) {
    const {clientX, clientY} = e.touches[0];
    this.dragMove(clientX, clientY);
    e.preventDefault();
  }

  handleWheel(e) {
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
          {t} = this.state;
    const vertices = layout.vertices.map((d) => {
      const color = d.selected ? 'red' : 'black';
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
            color={color}
            selectVertex={this.props.toggleSelectVertex}/>
      );
    });
    const edges = layout.edges.map((d) => {
      const color = edgeColor(d.upper, d.lower);
      return (
        <Edge
            key={`${d.u}:${d.v}`}
            t={t}
            points={d.points}
            points0={d.points0}
            reversed={d.reversed}
            edgeWidth="3"
            color={color}/>
      );
    });

    const svgTransform = `translate(${this.state.zoomX},${this.state.zoomY})scale(${this.state.zoomScale})`;
    return (
      <svg width="100%" height="100%"
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onTouchStart={this.handleTouchStart.bind(this)}
          onTouchEnd={this.handleTouchEnd.bind(this)}
          onTouchMove={this.handleTouchMove.bind(this)}
          onWheel={this.handleWheel.bind(this)}
          style={{cursor: 'move'}}>
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
