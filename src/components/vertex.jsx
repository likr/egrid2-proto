import React from 'react';
import {ladderUp, ladderDown, updateText, openConstructDialog} from '../app-actions';

class SvgButton extends React.Component {
  render() {
    return (
      <g transform={this.props.transform} onClick={this.props.onClick}>
        <rect
            width="24"
            height="24"
            fill="#ccc"/>
          <text y="24" className="material-icons">{this.props.icon}</text>
      </g>
    );
  }
}

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
        x0: this.props.d.x,
        y0: this.props.d.y
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
      ladderUp(this.props.d.u, text);
    });
  }

  handleClickLadderDownButton() {
    openConstructDialog((text) => {
      ladderDown(this.props.d.u, text);
    });
  }

  handleClickEditButton() {
    openConstructDialog((text) => {
      updateText(this.props.d.u, text);
    }, this.props.d.text);
  }

  render() {
    const {t} = this.props,
          {x0, y0} = this.state;
    const x = (this.props.d.x - x0) * t + x0,
          y = (this.props.d.y - y0) * t + y0,
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
        <g className="buttons" transform="translate(-42,0)">
          <SvgButton transform="translate(0,10)" icon="arrow_back" onClick={this.handleClickLadderUpButton.bind(this)}/>
          <SvgButton transform="translate(30,10)" icon="edit" onClick={this.handleClickEditButton.bind(this)}/>
          <SvgButton transform="translate(60,10)" icon="arrow_forward" onClick={this.handleClickLadderDownButton.bind(this)}/>
        </g>
      </g>
    );
  }
}

export default Vertex;
