import React from 'react';
import {connect} from 'redux/react';
import {Slider} from 'material-ui';
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
        <Slider
          name="coarse-graining"
          value={this.state.ratio}
          onChange={::this.handleChange}
          onDragStop={::this.handleDragStop}/>
      </div>
    );
  }

  handleChange(_, value) {
    this.setState({
      ratio: value
    });
  }

  handleDragStop() {
    this.props.dispatch(setCoarseGrainingRatio(this.state.ratio));
  }
}

export default CoarseGrainingController;
