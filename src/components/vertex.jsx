import React from 'react';
import {ladderDown, ladderUp, openConstructDialog, selectVertex, updateText} from '../app-actions';

class Vertex extends React.Component {
  shouldComponentUpdate(nextProps) {
    const attrs = ['t', 'selected', 'x', 'y', 'x0', 'y0', 'text'];
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
    const {t, x0, y0} = this.props;
    const x = (this.props.x - x0) * t + x0,
          y = (this.props.y - y0) * t + y0,
          color = this.props.selected ? 'red' : 'black';
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
        <circle r="5" fill={color} onClick={this.handleClick.bind(this)}/>
        <text style={textStyle} x="7" y="5" fill={color} fontSize="10pt" onClick={this.handleClick.bind(this)}>{this.props.text}</text>
      </g>
    );
  }
}

export default Vertex;
