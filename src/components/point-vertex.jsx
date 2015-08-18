import React from 'react';
import {animateTransform} from '../utils/shinsekai';

class PointVertex extends React.Component {
  componentDidMount() {
    const {x, y, x0, y0} = this.props;
    animateTransform(React.findDOMNode(this), {
      type: 'translate',
      from: `${x0} ${y0}`,
      to: `${x} ${y}`,
      dur: this.props.dur,
      delay: this.props.delay
    });
  }

  componentDidUpdate(prevProps) {
    const {x, y, x0, y0} = this.props;
    if (x !== prevProps.x || y !== prevProps.y) {
      const element = React.findDOMNode(this);
      for (const child of element.children) {
        if (child.tagName === 'animateTransform') {
          element.removeChild(child);
        }
      }
      animateTransform(element, {
        type: 'translate',
        from: `${x0} ${y0}`,
        to: `${x} ${y}`,
        dur: this.props.dur,
        delay: this.props.delay
      });
    }
  }

  handleClick() {
    this.props.selectVertex(this.props.u);
  }

  render() {
    const {x0, y0, width, height, strokeColor, fillColor} = this.props;
    return (
      <g
          className="vertex"
          style={{cursor: 'pointer'}}
          transform={`translate(${x0},${y0})`}
          onClick={this.handleClick.bind(this)}>
        <ellipse
          rx={width / 2}
          ry={height / 2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"/>
      </g>
    );
  }
}

export default PointVertex;
