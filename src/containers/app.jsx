import React from 'react';
import {bindActionCreators, createRedux} from 'redux';
import {Styles} from 'material-ui';
import {Connector, Provider} from 'redux/react';
import * as graphActions from '../actions/graph-actions';
import graphStore from '../stores/graph-store';
import Main from '../components/main';

const ThemeManager = new Styles.ThemeManager();
const redux = createRedux({graph: graphStore});

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
          <Connector select={(state) => ({graph: state.graph})}>
            {({dispatch, graph}) => {
              return (
                <Main graph={graph}
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
