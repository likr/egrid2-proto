import AppDispatcher from './app-dispatcher';

const loadGraph = (data) => {
  AppDispatcher.dispatch({
    actionType: 'load-graph',
    data: data
  });
};

const addConstruct = (text) => {
  AppDispatcher.dispatch({
    actionType: 'add-construct',
    text: text
  });
};

const GraphActions = {
  loadGraph,
  addConstruct
};

export default GraphActions;
