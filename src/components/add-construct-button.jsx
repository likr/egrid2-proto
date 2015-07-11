import React from 'react';
import {FontIcon, FloatingActionButton} from 'material-ui';
import {addConstruct, openConstructDialog} from '../app-actions';

class AddConstructButton extends React.Component {
  handleClickButton() {
    openConstructDialog((text) => {
      addConstruct(text);
    });
  }

  render() {
    const style = {
      margin: '10px'
    };
    return (
      <FloatingActionButton style={style} onClick={this.handleClickButton.bind(this)}>
        <FontIcon className="material-icons">add</FontIcon>
      </FloatingActionButton>
    );
  }
}

export default AddConstructButton;
