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
  updateText
};

export default AppActions;
