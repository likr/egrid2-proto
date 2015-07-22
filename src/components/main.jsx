/* global location,fetch */
import 'whatwg-fetch';
import {parse} from 'querystring';
import React from 'react';
import {Styles, FlatButton, TextField} from 'material-ui';
import Firebase from 'firebase';
import ExperimentStore from '../stores/experiment-store';
import GraphStore from '../stores/graph-store';
import {guess, loadGraph, selectVertex, setLayoutOptions, startExperiment} from '../app-actions';
import NetworkDiagram from './network-diagram';
import LayoutOptionsForm from './layout-options-form';

const ThemeManager = new Styles.ThemeManager();

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      u: null,
      v: null,
      uText: '',
      vText: '',
      name: '',
      started: false,
      finished: false,
      elapsedTime: 0,
      layout: GraphStore.getLayout(),
      query: ExperimentStore.getQuery(),
      problemCount: 0,
      correctCount: 0
    };
  }

  componentDidMount() {
    const query = {
      boxLayout: false,
      dataset: 'A',
      layerMargin: 30
    };
    Object.assign(query, parse(location.search.substr(1)));
    setLayoutOptions({
      boxLayout: !!(+query.box),
      layerMargin: +query.layerMargin
    });
    this.dataset = query.dataset;

    fetch(`data/${query.dataset}.json`)
      .then((response) => response.json())
      .then(loadGraph);

    ExperimentStore.addFinishListener(this.handleFinishExperiment.bind(this));
    ExperimentStore.addStartListener(this.handleStartExperiment.bind(this));
    ExperimentStore.addTickListener(this.handleTickExperiment.bind(this));
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

  handleClickStartButton() {
    startExperiment();
  }

  handleFinishExperiment() {
    this.setState({
      finished: true
    });
    const ref = new Firebase('https://egrid-r.firebaseio.com/items');
    ref.push({
      name: this.state.name,
      dataset: this.dataset,
      layerMargin: GraphStore.getLayerMargin(),
      layoutType: GraphStore.getLayoutType(),
      problemCount: this.state.problemCount,
      correctCount: this.state.correctCount,
      created: Firebase.ServerValue.TIMESTAMP
    });
  }

  handleInputName(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleStartExperiment() {
    this.setState({
      started: true
    });
  }

  handleTickExperiment() {
    this.setState({
      elapsedTime: ExperimentStore.getElapsedTime()
    });
  }

  handleUpdateQuery() {
    const {u, v, uText, vText} = ExperimentStore.getQuery();
    this.setState({
      u, v,
      uText, vText,
      problemCount: ExperimentStore.getProblemCount(),
      correctCount: ExperimentStore.getCorrectCount()
    });
  }

  handleClickYesButton() {
    guess(true);
  }

  handleClickNoButton() {
    guess(false);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    const view = () => {
      if (this.state.finished) {
        return (
          <div>
            <div>
              <p>正解率 {this.state.correctCount} / {this.state.problemCount}</p>
            </div>
          </div>
        );
      }
      if (this.state.started) {
        return (
          <div>
            <div>
              <p>経過時間 {this.state.elapsedTime} / 100</p>
              <p>正解率 {this.state.correctCount} / {this.state.problemCount}</p>
              <p>「{this.state.uText}」と「{this.state.vText}」にはつながりがありますか？</p>
            </div>
            <div>
              <FlatButton label="Yes" onClick={this.handleClickYesButton.bind(this)}/>
              <FlatButton label="No" onClick={this.handleClickNoButton.bind(this)}/>
            </div>
            <div style={{marginTop: '10px', width: '100%', height: '800px'}}>
              <NetworkDiagram layout={this.state.layout} u={this.state.u} v={this.state.v}/>
            </div>
          </div>
        );
      }
      return (
        <div>
          <TextField
            hintText="Your Name"
            floatingLabelText="Name"
            onChange={this.handleInputName.bind(this)}/>
          <FlatButton label="Start" onClick={this.handleClickStartButton.bind(this)}/>
        </div>
      );
    };
    return (
      <div style={{width: '1000px', marginLeft: 'auto', marginRight: 'auto'}}>
        {view()}
      </div>
    );
  }
}

Main.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Main;
