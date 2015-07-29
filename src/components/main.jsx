/* global fetch */
import React from 'react';
import {FlatButton} from 'material-ui';
import CoarseGrainingController from './coarse-graining-controller';
import NetworkDiagram from './network-diagram';
import ParticipantsList from './participants-list';

class Main extends React.Component {
  componentDidMount() {
    fetch(`data/graph.json`)
      .then((response) => response.json())
      .then(this.props.loadGraph);
  }

  render() {
    return (
      <div>
        <div style={{position: 'absolute', left: 0, right: '300px', top: 0, bottom: 0}}>
          <NetworkDiagram graph={this.props.graph} selection={this.props.selection} toggleSelectVertex={this.props.toggleSelectVertex}/>
        </div>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px',
            overflowX: 'hidden', overflowY: 'scroll', background: 'skyblue'}}>
          <div style={{marginLeft: '10px', marginTop: '10px'}}>
            <FlatButton label="Clear Selection" onClick={this.props.clearSelection}/>
            <CoarseGrainingController setCoarseGrainingRatio={this.props.setCoarseGrainingRatio}/>
            <ParticipantsList participants={this.props.participants} selectVerticesByParticipant={this.props.selectVerticesByParticipant}/>
          </div>
        </div>
    </div>
    );
  }
}

export default Main;
