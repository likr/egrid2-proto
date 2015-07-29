import React from 'react';
import NetworkDiagramContents from './network-diagram-contents';

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
          <NetworkDiagramContents
              graph={this.props.graph}
              selection={this.props.selection}
              toggleSelectVertex={this.props.toggleSelectVertex}/>
        </g>
      </svg>
    );
  }
}

export default NetworkDiagram;
