/* global fetch */
import 'whatwg-fetch';
import React from 'react';
import {Styles} from 'material-ui';
import GraphStore from '../stores/graph-store';
import {loadGraph} from '../app-actions';
import NetworkDiagram from './network-diagram';

const ThemeManager = new Styles.ThemeManager();

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: GraphStore.getLayout()
    };
  }

  componentDidMount() {
    fetch(`data/graph.json`)
      .then((response) => response.json())
      .then(loadGraph);

    GraphStore.addChangeListener(this.handleChangeLayout.bind(this));
  }

  componentWillMount() {
    ThemeManager.setComponentThemes({
      toggle: {
        thumbOnColor: String,
        trackOnColor: String
      }
    });
  }

  handleChangeLayout() {
    this.setState({
      layout: GraphStore.getLayout()
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: '10px'}}>
        <NetworkDiagram layout={this.state.layout} u={this.state.u} v={this.state.v}/>
      </div>
    );
  }
}

Main.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Main;
