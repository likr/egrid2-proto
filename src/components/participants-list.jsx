import React from 'react';

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
    this.props.selectVerticesByParticipant(participant);
  }
}

export default ParticipantsList;
