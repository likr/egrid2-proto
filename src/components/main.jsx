/* global location,fetch */
import 'whatwg-fetch';
import {parse} from 'querystring';
import React from 'react';
import {Styles, FlatButton} from 'material-ui';
import ExperimentStore from '../stores/experiment-store';
import GraphStore from '../stores/graph-store';
import {loadGraph, setLayoutOptions} from '../app-actions';
import NetworkDiagram from './network-diagram';
import LayoutOptionsForm from './layout-options-form';

const ThemeManager = new Styles.ThemeManager();

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: GraphStore.getLayout(),
      query: ExperimentStore.getQuery(),
      problemCount: 0,
      correctCount: 0
    };
  }

  componentDidMount() {
    const query = {
      boxLayout: false,
      layerMargin: 30
    };
    Object.assign(query, parse(location.search.substr(1)));
    setLayoutOptions({
      boxLayout: !!(+query.box),
      layerMargin: +query.layerMargin
    });

    fetch('data/univ.json')
      .then((response) => response.json())
      .then(loadGraph);

    ExperimentStore.addUpdateListener(this.handleUpdateQuery.bind(this));
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

  handleUpdateQuery() {
    this.setState({
      query: ExperimentStore.getQuery(),
      problemCount: ExperimentStore.getProblemCount(),
      correctCount: ExperimentStore.getCorrectCount()
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <div style={{width: '1280px', marginLeft: 'auto', marginRight: 'auto'}}>
        <div>
          <FlatButton label="Box - Short" linkButton={true} href="?layerMargin=20&box=1"/>
          <FlatButton label="Box - Long" linkButton={true} href="?layerMargin=80&box=1"/>
          <FlatButton label="Point - Short" linkButton={true} href="?layerMargin=20&box=0"/>
          <FlatButton label="Point - Long" linkButton={true} href="?layerMargin=80&box=0"/>
        </div>
        <div>
          <p>正解率 {this.state.correctCount} / {this.state.problemCount}</p>
          <p>「{this.state.query}」をクリックしてください</p>
        </div>
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
