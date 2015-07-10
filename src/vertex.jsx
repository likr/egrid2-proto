import React from 'react';
import mixin from 'react-mixin';
import Animate from './react-animate';

class Vertex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: 0,
      x0: 0,
      y0: 0,
      selected: false
    };
  }

  componentDidMount() {
    this.animate({t: 1}, 500);
  }

  render() {
    const {x0, y0, t} = this.state;
    const x = (this.props.position.x - x0) * t + x0,
          y = (this.props.position.y - y0) * t + y0,
          color = this.state.selected ? 'red' : 'black';
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
      <g className="vertex" style={style} transform={`translate(${x},${y})`} onClick={this.onClick.bind(this)}>
        <circle r="5" fill={color}/>
        <text style={textStyle} x="7" y="5" fill={color}>{this.props.d.text}</text>
      </g>
    );
  }

  onClick() {
    this.setState({
      selected: !this.state.selected
    });
  }
}

mixin(Vertex.prototype, Animate);

export default Vertex;
