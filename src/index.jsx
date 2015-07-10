import React from 'react';
import GraphStore from './graph-store';
import {loadGraph} from './graph-actions';
import NetworkDiagram from './network-diagram';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graph: GraphStore.getGraph()
    };
  }

  componentDidMount() {
    fetch('data/graph.json')
      .then((response) => response.json())
      .then(loadGraph);
    GraphStore.addChangeListener(this.onChangeGraph.bind(this));
  }

  componentWillUnmount() {
    GraphStore.removeChangeListener(this.onChangeGraph.bind(this));
  }

  onChangeGraph() {
    this.setState({
      graph: GraphStore.getGraph()
    });
  }

  render() {
    const wrapperStyle = {
      position: 'absolute',
      top: 0,
      bottom: '10px',
      left: 0,
      right: 0
    };
    return (
      <div style={wrapperStyle}>
        <NetworkDiagram graph={this.state.graph}/>
      </div>
    );
  }
}

React.render(<Main/>, document.getElementById('content'));
