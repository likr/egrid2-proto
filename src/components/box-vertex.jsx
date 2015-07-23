import React from 'react';
import {selectVertex} from '../app-actions';

class BoxVertex extends React.Component {
  shouldComponentUpdate(nextProps) {
    const attrs = ['t', 'color', 'x', 'y', 'x0', 'y0', 'text'];
    for (const attr of attrs) {
      if (this.props[attr] !== nextProps[attr]) {
        return true;
      }
    }
    return false;
  }

  handleClick() {
    selectVertex(this.props.u);
  }

  render() {
    const {t, x0, y0, width, height, color} = this.props;
    const x = (this.props.x - x0) * t + x0,
          y = (this.props.y - y0) * t + y0;
    const style = {
      cursor: 'pointer'
    };
    const textStyle = {
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      MsUserSelect: 'none'
    };
    return (
      <g className="vertex" style={style} transform={`translate(${x},${y})`}>
        <rect
            x={-width / 2}
            y={-height / 2}
            rx="0"
            width={width}
            height={height}
            fill="none"
            stroke={color}
            onClick={this.handleClick.bind(this)}/>
        <text
            style={textStyle}
            x="0"
            y="5"
            fill={color}
            textAnchor="middle"
            fontSize="10pt"
            onClick={this.handleClick.bind(this)}>
          {this.props.text}
        </text>
      </g>
    );
  }
}

export default BoxVertex;
