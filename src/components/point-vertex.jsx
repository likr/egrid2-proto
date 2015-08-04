import React from 'react';
import cutoff from '../utils/cutoff';
import {animateTransform} from '../utils/shinsekai';

class PointVertex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: cutoff(props.text)
    };
  }

  componentDidMount() {
    const {x, y, x0, y0} = this.props;
    animateTransform(React.findDOMNode(this), {
      type: 'translate',
      from: `${x0} ${y0}`,
      to: `${x} ${y}`,
      dur: this.props.dur,
      delay: this.props.delay
    });
  }

  componentDidUpdate(prevProps) {
    const {x, y, x0, y0} = this.props;
    if (x !== prevProps.x || y !== prevProps.y) {
      const element = React.findDOMNode(this);
      for (const child of element.children) {
        if (child.tagName === 'animateTransform') {
          element.removeChild(child);
        }
      }
      animateTransform(element, {
        type: 'translate',
        from: `${x0} ${y0}`,
        to: `${x} ${y}`,
        dur: this.props.dur,
        delay: this.props.delay
      });
    }
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
    const {x0, y0, width, height, color} = this.props;
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
          transform={`translate(${x0},${y0})`}
          onClick={this.handleClick.bind(this)}
          onMouseOver={this.handleMouseOver.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}>
        <ellipse
          rx={width / 2}
          ry={height / 2}
          fill={color}/>
        <text
          style={textStyle}
          x={width / 2 + 1}
          y="6"
          fontFamily='"Lucida Grande","Hiragino Kaku Gothic ProN","ヒラギノ角ゴ ProN W3",Meiryo,メイリオ,sans-serif'
          fontSize="10pt">
          {this.state.text}
        </text>
      </g>
    );
  }
}

export default PointVertex;
