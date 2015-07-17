/* global location,fetch */
import 'whatwg-fetch';
import {parse} from 'querystring';
import React from 'react';
import {Styles, FlatButton} from 'material-ui';
import GraphStore from '../stores/graph-store';
import {loadGraph, setLayoutOptions} from '../app-actions';
import NetworkDiagram from './network-diagram';
import LayoutOptionsForm from './layout-options-form';

const ThemeManager = new Styles.ThemeManager();

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: GraphStore.getLayout()
    };
  }

  componentDidMount() {
    const query = {
      boxLayout: false,
      layerMargin: 30
    };
    Object.assign(query, parse(location.search.substr(1)));
    console.log(query);
    setLayoutOptions({
      boxLayout: !!(+query.box),
      layerMargin: +query.layerMargin
    });
    fetch('data/graph.json')
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

  componentWillUnmount() {
    GraphStore.removeChangeListener(this.handleChangeLayout.bind(this));
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
      <div style={{width: '1024px', marginLeft: 'auto', marginRight: 'auto'}}>
        <FlatButton label="Box - Short" linkButton={true} href="?layerMargin=30&box=1"/>
        <FlatButton label="Box - Long" linkButton={true} href="?layerMargin=150&box=1"/>
        <FlatButton label="Point - Short" linkButton={true} href="?layerMargin=30&box=0"/>
        <FlatButton label="Point - Long" linkButton={true} href="?layerMargin=150&box=0"/>
        <div style={{width: '100%', height: '800px'}}>
          <NetworkDiagram layout={this.state.layout}/>
        </div>
      </div>
    );
  }
}

Main.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Main;
