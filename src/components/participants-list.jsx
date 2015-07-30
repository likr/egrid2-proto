import React from 'react';
import {connect} from 'redux/react';
import {selectVerticesByParticipant} from '../actions/graph-actions';

@connect((state) => ({
  graph: state.graph,
  participants: state.participants
}))
class ParticipantsList extends React.Component {
  render() {
    const participants = this.props.participants.map((participant, i) => {
      return (
        <p
          key={participant}
          style={{cursor: 'pointer'}}
          onClick={this.handleClickParticipant.bind(this, participant)}>
          Participant {i + 1}
        </p>
      );
    });
    return (
      <div>
        <h3>Participants</h3>
        {participants}
      </div>
    );
  }

  handleClickParticipant(participant) {
    this.props.dispatch(selectVerticesByParticipant(this.props.graph, participant));
  }
}

export default ParticipantsList;
