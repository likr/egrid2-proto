import React from 'react';

class ParticipantsList extends React.Component {
  render() {
    const participants = this.props.participants.map((participant) => {
      return (
        <p
          key={participant}
          style={{cursor: 'pointer'}}
          onClick={this.handleClickParticipant.bind(this, participant)}>
          {participant}
        </p>
      );
    });
    return (
      <div style={{marginLeft: '10px'}}>
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
