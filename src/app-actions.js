import AppDispatcher from './app-dispatcher';

const addConstruct = (text) => {
  AppDispatcher.dispatch({
    actionType: 'add-construct',
    text
  });
};

const ladderDown = (u, text) => {
  AppDispatcher.dispatch({
    actionType: 'ladder-down',
    text,
    u
  });
};

const ladderUp = (u, text) => {
  AppDispatcher.dispatch({
    actionType: 'ladder-up',
    text,
    u
  });
};

const loadGraph = (data) => {
  AppDispatcher.dispatch({
    actionType: 'load-graph',
    data
  });
};

const openConstructDialog = (callback, text='', constructs=[]) => {
  AppDispatcher.dispatch({
    actionType: 'open-construct-dialog',
    callback,
    text,
    constructs
  });
};

const removeSelectedConstructs = () => {
  AppDispatcher.dispatch({
    actionType: 'remove-selected-constructs'
  });
};

const selectVertex = (u) => {
  AppDispatcher.dispatch({
    actionType: 'select-vertex',
    u
  });
};

const setLayoutOptions = (options) => {
  AppDispatcher.dispatch({
    actionType: 'set-layout-options',
    options
  });
};

const startExperiment = () => {
  AppDispatcher.dispatch({
    actionType: 'start-experiment'
  });
};

const updateText = (u, text) => {
  AppDispatcher.dispatch({
    actionType: 'update-text',
    text,
    u
  });
};

const AppActions = {
  addConstruct,
  ladderDown,
  ladderUp,
  loadGraph,
  openConstructDialog,
  removeSelectedConstructs,
  selectVertex,
  setLayoutOptions,
  startExperiment,
  updateText
};

export default AppActions;
