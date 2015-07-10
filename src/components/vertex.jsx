import React from 'react';
import mixin from 'react-mixin';
import Animate from '../react-animate';
import {ladderUp, ladderDown, openConstructDialog} from '../app-actions';

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

  handleClick() {
    this.setState({
      selected: !this.state.selected
    });
  }

  handleClickLadderUpButton() {
    console.log('ladder up');
    openConstructDialog((text) => {
      ladderUp(this.props.u, text);
    });
  }

  handleClickLadderDownButton() {
    console.log('ladder down');
    openConstructDialog((text) => {
      ladderDown(this.props.u, text);
    });
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
      <g className="vertex" style={style} transform={`translate(${x},${y})`}>
        <circle r="5" fill={color} onClick={this.handleClick.bind(this)}/>
        <text style={textStyle} x="7" y="5" fill={color} onClick={this.handleClick.bind(this)}>{this.props.d.text}</text>
        <g className="buttons" transform="translate(-20,0)">
          <rect
              y="10"
              width="20"
              height="20"
              fill="#888"
              onClick={this.handleClickLadderUpButton.bind(this)}
          />
          <rect
              x="25"
              y="10"
              width="20"
              height="20"
              fill="#888"
              onClick={this.handleClickLadderDownButton.bind(this)}
          />
        </g>
      </g>
    );
  }
}

mixin(Vertex.prototype, Animate);

export default Vertex;
