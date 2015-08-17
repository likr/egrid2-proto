import {LOAD_GRAPH} from '../constants';

const handleLoadGraph = (state, data) => {
  const participants = new Set();
  for (const {d} of data.vertices) {
    for (const participant of d.participants) {
      participants.add(participant);
    }
  }
  return Array.from(participants);
};

const participantsStore = (state=[], action) => {
  switch (action.type) {
    case LOAD_GRAPH:
      return handleLoadGraph(state, action.data);
    default:
      return state;
  }
};

export default participantsStore;
