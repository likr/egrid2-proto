import {CLEAR_SELECTION, LOAD_GRAPH, SELECT_VERTICES, SELECT_VERTICES_BY_PARTICIPANT, TOGGLE_SELECT_VERTEX, UNSELECT_VERTICES} from '../constants';

export const clearSelection = () => {
  return {
    type: CLEAR_SELECTION
  };
};

export const loadGraph = (data) => {
  return {
    type: LOAD_GRAPH,
    data
  };
};

export const selectVertices = (vertices) => {
  return {
    type: SELECT_VERTICES,
    vertices
  };
};

export const selectVerticesByParticipant = (participant) => {
  return {
    type: SELECT_VERTICES_BY_PARTICIPANT,
    participant
  };
};

export const toggleSelectVertex = (u) => {
  return {
    type: TOGGLE_SELECT_VERTEX,
    u
  };
};

export const unselectVertices = (vertices) => {
  return {
    type: UNSELECT_VERTICES,
    vertices
  };
};
