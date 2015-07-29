import React from 'react';
import {createRedux} from 'redux';
import {Styles} from 'material-ui';
import {Provider} from 'redux/react';
import graphStore from '../stores/graph-store';
import participantsStore from '../stores/participants-store';
import selectionStore from '../stores/selection-store';
import Main from '../components/main';

const ThemeManager = new Styles.ThemeManager();
const redux = createRedux({
  graph: graphStore,
  participants: participantsStore,
  selection: selectionStore
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
          <Main/>
        )}
      </Provider>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default App;
