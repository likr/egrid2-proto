import React from 'react';
import mixin from 'react-mixin';
import Graph from 'eg-graph/lib/graph';
import Animate from '../react-animate';
import Vertex from './vertex';
import Edge from './edge';

class NetworkDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 0,
      x0: 0,
      y0: 0,
      draggin: false,
      zoomX: 50,
      zoomY: 50,
      zoomScale: 1
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.layout !== nextProps.layout) {
      this.setState({
        t: 0
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.layout !== prevProps.layout) {
      this.animate({t: 1}, 1000);
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
    const {layout} = this.props,
          {t} = this.state;
    const vertices = layout.vertices.map((d) => {
      return <Vertex key={d.u} t={t} d={d}/>;
    });
    const edges = layout.edges.map((d) => {
      return <Edge key={`${d.u}:${d.v}`} t={t} d={d}/>;
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

mixin(NetworkDiagram.prototype, Animate);

export default NetworkDiagram;
