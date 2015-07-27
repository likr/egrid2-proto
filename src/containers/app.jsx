import React from 'react';
import {bindActionCreators, createRedux} from 'redux';
import {Styles} from 'material-ui';
import {Connector, Provider} from 'redux/react';
import * as graphActions from '../actions/graph-actions';
import graphStore from '../stores/graph-store';
import participantsStore from '../stores/participants-store';
import Main from '../components/main';

const ThemeManager = new Styles.ThemeManager();
const redux = createRedux({
  graph: graphStore,
  participants: participantsStore
});

class App extends React.Component {
  componentWillMount() {
    ThemeManager.setComponentThemes({
      toggle: {
        thumbOnColor: String,
        trackOnColor: String
      }
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <Provider redux={redux}>
        {() => (
          <Connector select={(state) => ({graph: state.graph, participants: state.participants})}>
            {({dispatch, graph, participants}) => {
              return (
                <Main graph={graph} participants={participants}
                    {...bindActionCreators(graphActions, dispatch)}/>
              );
            }}
          </Connector>
        )}
      </Provider>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default App;
