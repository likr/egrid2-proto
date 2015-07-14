import React from 'react';

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
      t: 0
    };
  }

  render() {
    const t = this.props.t,
          n0 = this.props.d.points0.length;
    const points = this.props.d.points.map((point, i) => {
      const [x, y] = point,
            [x0, y0] = i < n0 ? this.props.d.points0[i] : this.props.d.points0[n0 - 1];
      return [(x - x0) * t + x0, (y - y0) * t + y0];
    });
    const edgeColor = this.props.d.selected ? '#ffc0cb' : '#eee';
    return (
      <g className="edge">
        <path
            d={svgPath(points, true)}
            fill="none"
            stroke={edgeColor}
            strokeDasharray={this.props.d.reversed ? 5 : 'none'}
            strokeWidth="3"
        />
      </g>
    );
  }
}

export default Edge;
