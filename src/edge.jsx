import React from 'react';
import mixin from 'react-mixin';
import Animate from './react-animate';

const startFrom = ([x, y]) => {
  return `M${x} ${y}`;
};

const lineTo = ([x, y]) => {
  return ` L${x} ${y}`;
};

const curveTo = ([x1, y1], [x2, y2], ltor) => {
  const dx = x2 - x1,
        dy = y2 - y1;
  return ltor
    ? ` q${dx / 4} ${0},${dx / 2} ${dy / 2} q${dx / 4} ${dy / 2},${dx / 2} ${dy / 2}`
    : ` q${0} ${dy / 4},${dx / 2} ${dy / 2} q${dx / 2} ${dy / 4},${dx / 2} ${dy / 2}`;
};

const svgPath = (points, ltor) => {
  let d = `${startFrom(points[0])}${lineTo(points[1])}`;
  for (let i = 3; i < points.length; i += 2) {
    d += curveTo(points[i - 2], points[i - 1], ltor) + lineTo(points[i]);
  }
  return d;
};

class Edge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 0,
      points0: props.points.map(() => [0, 0])
    };
  }

  componentDidMount() {
    this.animate({t: 1}, 500);
  }

  render() {
    const t = this.state.t;
    const points = this.props.points.map((point, i) => {
      const [x, y] = point,
            [x0, y0] = i < this.state.points0.length ? this.state.points0[i] : point;
      return [(x - x0) * t + x0, (y - y0) * t + y0];
    });
    return (
      <g className="edge">
        <path fill="none" stroke="#ccc" d={svgPath(points, true)}/>
      </g>
    );
  }
}

mixin(Edge.prototype, Animate);

export default Edge;