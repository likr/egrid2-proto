/* global fetch */
import 'whatwg-fetch';
import React from 'react';
import {Styles} from 'material-ui';
import GraphStore from './graph-store';
import {loadGraph} from './graph-actions';
import AddConstructButton from './add-construct-button';
import NetworkDiagram from './network-diagram';

const ThemeManager = new Styles.ThemeManager();

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

  componentWillMount() {
    ThemeManager.setComponentThemes({
      toggle: {
        thumbOnColor: String,
        trackOnColor: String
      }
    });
  }

  componentWillUnmount() {
    GraphStore.removeChangeListener(this.onChangeGraph.bind(this));
  }

  onChangeGraph() {
    this.setState({
      graph: GraphStore.getGraph()
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    const wrapperStyle = {
      position: 'absolute',
      top: 0,
      bottom: '10px',
      left: 0,
      right: 0
    };
    const buttonsStyle = {
      position: 'absolute',
      left: 10,
      bottom: 10
    };
    return (
      <div>
        <div style={wrapperStyle}>
          <NetworkDiagram graph={this.state.graph}/>
        </div>
        <div style={buttonsStyle}>
          <AddConstructButton/>
        </div>
      </div>
    );
  }
}

Main.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Main;
