import {LOAD_GRAPH, SELECT_VERTICES, TOGGLE_SELECT_VERTEX, UNSELECT_VERTICES} from '../constants';

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
