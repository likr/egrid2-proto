/* global fetch */
import React from 'react';
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
        <div style={{position: 'absolute', left: 0, right: '200px', top: 0, bottom: '10px'}}>
          <NetworkDiagram layout={this.props.graph} toggleSelectVertex={this.props.toggleSelectVertex}/>
        </div>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: '10px', width: '200px',
            overflowX: 'hidden', overflowY: 'scroll', background: 'skyblue'}}>
          <ParticipantsList participants={this.props.participants} selectVerticesByParticipant={this.props.selectVerticesByParticipant}/>
        </div>
    </div>
    );
  }
}

export default Main;
