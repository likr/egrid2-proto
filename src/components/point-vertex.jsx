import React from 'react';
import cutoff from '../utils/cutoff';

class PointVertex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: cutoff(props.text)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const attrs = ['t', 'color', 'x', 'y', 'x0', 'y0', 'text'];
    for (const attr of attrs) {
      if (this.props[attr] !== nextProps[attr]) {
        return true;
      }
    }
    if (this.state.text !== nextState.text) {
      return true;
    }
    return false;
  }

  handleClick() {
    this.props.selectVertex(this.props.u);
  }

  handleMouseOver() {
    this.setState({
      text: this.props.text
    });
  }

  handleMouseLeave() {
    setTimeout(() => {
      this.setState({
        text: cutoff(this.props.text)
      });
    }, 2000);
  }

  render() {
    const {t, x0, y0, color} = this.props;
    const x = (this.props.x - x0) * t + x0,
          y = (this.props.y - y0) * t + y0;
    const textStyle = {
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      MsUserSelect: 'none'
    };
    return (
      <g
          className="vertex"
          style={{cursor: 'pointer'}}
          transform={`translate(${x},${y})`}
          onClick={this.handleClick.bind(this)}
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}>
        <circle
          r="5"
          fill={color}/>
        <text
          style={textStyle}
          x="7"
          y="6"
          fontSize="10pt">
          {this.state.text}
        </text>
      </g>
    );
  }
}

export default PointVertex;
