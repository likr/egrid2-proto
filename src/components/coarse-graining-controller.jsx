import React from 'react';
import {connect} from 'redux/react';
import Slider from 'react-slider';
import {setCoarseGrainingRatio} from '../actions/graph-actions';

@connect(() => ({}))
class CoarseGrainingController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 0
    };
  }

  render() {
    return (
      <div>
        <h3>Coarse-graining criteria</h3>
        <div>
          <Slider
              min={0}
              max={1}
              step={0.01}
              value={this.state.ratio}
              withBars
              onChange={::this.handleChange}
              onAfterChange={::this.handleAfterChange}>
            <span>{this.state.ratio.toFixed(2)}</span>
          </Slider>
        </div>
      </div>
    );
  }

  handleChange(value) {
    this.setState({
      ratio: value
    });
  }

  handleAfterChange() {
    this.props.dispatch(setCoarseGrainingRatio(this.state.ratio));
  }
}

export default CoarseGrainingController;
