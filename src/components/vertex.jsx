import React from 'react';
import {ladderUp, ladderDown, openConstructDialog} from '../app-actions';

class Vertex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x0: 0,
      y0: 0,
      selected: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.t === 1) {
      this.setState({
        x0: this.props.position.x,
        y0: this.props.position.y
      });
    }
  }

  handleClick() {
    this.setState({
      selected: !this.state.selected
    });
  }

  handleClickLadderUpButton() {
    openConstructDialog((text) => {
      ladderUp(this.props.u, text);
    });
  }

  handleClickLadderDownButton() {
    openConstructDialog((text) => {
      ladderDown(this.props.u, text);
    });
  }

  render() {
    const {t} = this.props,
          {x0, y0} = this.state;
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

export default Vertex;
