import React from 'react';
import NetworkDiagram from './network-diagram';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        vertices: [],
        edges: []
      }
    };
  }

  componentDidMount() {
    fetch('data/graph.json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({data: data});
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
        <NetworkDiagram data={this.state.data}/>
      </div>
    );
  }
}

React.render(<Main/>, document.getElementById('content'));
