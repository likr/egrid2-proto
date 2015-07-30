import {
  CLEAR_SELECTION,
  LOAD_GRAPH,
  SET_COARSE_GRAINING_RATIO,
  SELECT_VERTICES,
  TOGGLE_SELECT_VERTEX,
  UNSELECT_VERTICES
} from '../constants';

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

export const setCoarseGrainingRatio = (ratio) => {
  return {
    type: SET_COARSE_GRAINING_RATIO,
    ratio
  };
};

export const selectVertices = (vertices) => {
  return {
    type: SELECT_VERTICES,
    vertices
  };
};

export const selectVerticesByParticipant = (graph, participant) => {
  const vertices = graph.vertices()
    .filter((u) => graph.vertex(u).participants.indexOf(participant) > -1);
  return {
    type: SELECT_VERTICES,
    vertices
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
