/* global fetch */
import 'whatwg-fetch';
import React from 'react';
import NetworkDiagram from './network-diagram';

class Main extends React.Component {
  componentDidMount() {
    fetch(`data/graph.json`)
      .then((response) => response.json())
      .then(this.props.loadGraph);
  }

  render() {
    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: '10px'}}>
        <NetworkDiagram layout={this.props.graph} toggleSelectVertex={this.props.toggleSelectVertex}/>
      </div>
    );
  }
}

export default Main;
