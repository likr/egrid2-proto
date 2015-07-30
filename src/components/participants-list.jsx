import React from 'react';
import {connect} from 'redux/react';
import {Table} from 'material-ui';
import {selectVerticesByParticipant} from '../actions/graph-actions';

@connect((state) => ({
  graph: state.graph,
  participants: state.participants,
  selection: state.selection
}))
class ParticipantsList extends React.Component {
  render() {
    const columnOrder = ['name', 'category'];
    const headerColumns = {
      name: {
        content: 'Name'
      },
      category: {
        content: 'Category'
      }
    };
    const rowData = this.props.participants.map((participant, i) => {
      const active = Array.from(this.props.selection).some((u) => this.props.graph.vertex(u).participants.indexOf(participant) > -1);
      return {
        selected: active,
        name: {
          content: `Participant ${i + 1}`
        },
        category: {
          content: i % 2 ? 'Negative' : 'Positive'
        }
      };
    });
    console.log(rowData);
    return (
      <div>
        <h3>Participants</h3>
        <Table
            columnOrder={columnOrder}
            displayRowCheckbox={false}
            displaySelectAll={false}
            headerColumns={headerColumns}
            multiSelectable={true}
            onRowSelection={::this.handleClickParticipant}
            rowData={rowData}/>
      </div>
    );
  }

  handleClickParticipant([i]) {
    this.props.dispatch(selectVerticesByParticipant(this.props.graph, this.props.participants[i]));
  }
}

export default ParticipantsList;
