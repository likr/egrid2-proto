/* global fetch */
import React from 'react';
import {connect} from 'redux/react';
import {FlatButton} from 'material-ui';
import {clearSelection, loadGraph} from '../actions/graph-actions';
import CoarseGrainingController from './coarse-graining-controller';
import NetworkDiagram from './network-diagram';
import ParticipantsList from './participants-list';

@connect(() => ({}))
class Main extends React.Component {
  componentDidMount() {
    fetch(`data/graph.json`)
      .then((response) => response.json())
      .then((data) => {
        this.props.dispatch(loadGraph(data));
      });
  }

  render() {
    return (
      <div>
        <div style={{position: 'absolute', left: 0, right: '300px', top: 0, bottom: 0}}>
          <NetworkDiagram/>
        </div>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px',
            overflowX: 'hidden', overflowY: 'scroll', background: 'skyblue'}}>
          <div style={{marginLeft: '10px', marginTop: '10px'}}>
            <FlatButton label="Clear Selection" onClick={::this.handleClickClearSelectionButton}/>
            <CoarseGrainingController/>
            <ParticipantsList/>
          </div>
        </div>
    </div>
    );
  }

  handleClickClearSelectionButton() {
    this.props.dispatch(clearSelection());
  }
}

export default Main;
