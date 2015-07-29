import React from 'react';
import {Slider} from 'material-ui';

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
        <div style={{width: '100%'}}>
          <Slider
            name="coarse-graining"
            value={this.state.ratio}
            onChange={this.handleChange.bind(this)}
            onDragStop={this.handleDragStop.bind(this)}/>
        </div>
      </div>
    );
  }

  handleChange(_, value) {
    this.setState({
      ratio: value
    });
  }

  handleDragStop() {
    this.props.setCoarseGrainingRatio(this.state.ratio);
  }
}

export default CoarseGrainingController;
