import {
  CLEAR_SELECTION,
  SELECT_VERTICES,
  TOGGLE_SELECT_VERTEX
} from '../constants';

const handleClearSelection = () => {
  return new Set();
};

const handleSelectVertices = (state, vertices) => {
  const result = new Set(state);
  for (const u of vertices) {
    result.add(u);
  }
  return result;
};

const handleToggleSelection = (state, u) => {
  const result = new Set(state);
  if (result.has(u)) {
    result.delete(u);
  } else {
    result.add(u);
  }
  return result;
};

const selectionStore = (state=null, action) => {
  if (state === null) {
    state = new Set();
  }
  switch (action.type) {
    case CLEAR_SELECTION:
      return handleClearSelection();
    case SELECT_VERTICES:
      return handleSelectVertices(state, action.vertices);
    case TOGGLE_SELECT_VERTEX:
      return handleToggleSelection(state, action.u);
    default:
      return state;
  }
};

export default selectionStore;
