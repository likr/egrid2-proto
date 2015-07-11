import React from 'react';
import {FontIcon, FloatingActionButton} from 'material-ui';
import {removeSelectedConstructs} from '../app-actions';

class RemoveSelectedConstructsButton extends React.Component {
  handleClickButton() {
    removeSelectedConstructs();
  }

  render() {
    const style = {
      margin: '10px'
    };
    return (
      <FloatingActionButton style={style} onClick={this.handleClickButton.bind(this)}>
        <FontIcon className="material-icons">delete</FontIcon>
      </FloatingActionButton>
    );
  }
}

export default RemoveSelectedConstructsButton;
