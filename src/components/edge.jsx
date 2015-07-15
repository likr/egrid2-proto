import React from 'react';

const startFrom = (x, y) => {
  return `M${x} ${y}`;
};

const lineTo = (x, y) => {
  return ` L${x} ${y}`;
};

const curveTo = (x1, y1, x2, y2) => {
  const dx = x2 - x1,
        dy = y2 - y1,
        dx2 = dx / 2,
        dy2 = dy / 2,
        dx4 = dx / 4;
  return ` q${dx4} 0,${dx2} ${dy2} q${dx4} ${dy2},${dx2} ${dy2}`;
};

const interpolate = (a, a0, t) => {
  return (a - a0) * t + a0;
};

const svgPath = (points, points0, t) => {
  const x0 = interpolate(points[0][0], points0[0][0], t),
        y0 = interpolate(points[0][1], points0[0][1], t),
        x1 = interpolate(points[1][0], points0[1][0], t),
        y1 = interpolate(points[1][1], points0[1][1], t),
        x2 = interpolate(points[2][0], points0[2][0], t),
        y2 = interpolate(points[2][1], points0[2][1], t),
        x3 = interpolate(points[3][0], points0[3][0], t),
        y3 = interpolate(points[3][1], points0[3][1], t),
        x4 = interpolate(points[4][0], points0[4][0], t),
        y4 = interpolate(points[4][1], points0[4][1], t),
        x5 = interpolate(points[5][0], points0[5][0], t),
        y5 = interpolate(points[5][1], points0[5][1], t);
  return (startFrom(x0, y0) + lineTo(x1, y1)
          + curveTo(x1, y1, x2, y2) + lineTo(x3, y3)
          + curveTo(x3, y3, x4, y4) + lineTo(x5, y5));
};

class Edge extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.props.edgeWidth !== nextProps.edgeWidth) {
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
    const {points, points0, t, color, edgeWidth} = this.props;
    return (
      <g className="edge">
        <path
            d={svgPath(points, points0, t)}
            fill="none"
            stroke={color}
            strokeDasharray={this.props.reversed ? 5 : 'none'}
            strokeWidth={edgeWidth}
        />
      </g>
    );
  }
}

export default Edge;
