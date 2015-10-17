import React from 'react';
import {animateTransform} from '../utils/shinsekai';

class TextLabel extends React.Component {
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

  render() {
    const {text, x0, y0, textWidth, textHeight, fillColor, selected} = this.props;
    return (
      <g
          style={{cursor: 'pointer'}}
          transform={`translate(${x0},${y0})`}
          onClick={this.handleClick.bind(this)}>
        {selected ? (
          <rect
            fill="white"
            opacity="0.8"
            x={-textWidth / 2}
            y={-textHeight + 7}
            width={textWidth}
            height={textHeight}/>
        ) : null}
        {selected ? (
          <text
              style={{
                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                MsUserSelect: 'none'
              }}
              x="0"
              y="7"
              fill={fillColor}
              textAnchor="middle"
              fontFamily='"Lucida Grande","Hiragino Kaku Gothic ProN","ヒラギノ角ゴ ProN W3",Meiryo,メイリオ,sans-serif'
              fontSize="14">
            {text}
          </text>
        ) : null}
      </g>
    );
  }
}

export default TextLabel;
