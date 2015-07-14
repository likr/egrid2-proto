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
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    if (this.props.selected !== nextProps.selected) {
      return true;
    }
    const pointsChanged = this.props.points.some(([x, y], i) => {
      const [x0, y0] = nextProps.points[i];
      return x !== x0 || y !== y0;
    });
    if (pointsChanged) {
      return true;
    }
    const points0Changed = this.props.points0.some(([x, y], i) => {
      const [x0, y0] = nextProps.points0[i];
      return x !== x0 || y !== y0;
    });
    if (points0Changed) {
      return true;
    }
    return false;
  }

  render() {
    const t = this.props.t;
    const points = this.props.points.map((point, i) => {
      const [x, y] = point,
            [x0, y0] = this.props.points0[i];
      return [(x - x0) * t + x0, (y - y0) * t + y0];
    });
    const edgeColor = this.props.selected ? '#ffc0cb' : '#eee';
    return (
      <g className="edge">
        <path
            d={svgPath(points, true)}
            fill="none"
            stroke={edgeColor}
            strokeDasharray={this.props.reversed ? 5 : 'none'}
            strokeWidth="3"
        />
      </g>
    );
  }
}

export default Edge;
