import React from 'react';
import {Dialog, FontIcon, FloatingActionButton, TextField} from 'material-ui';
import {addConstruct} from '../graph-actions';

class ConstructTextField extends React.Component {
  componentDidMount() {
    React.findDOMNode(this).children[1].focus();
  }

  render() {
    return (
      <TextField
          hintText="Construct"
          fullWidth={true}
          onChange={this.props.onChange}
          onEnterKeyDown={this.props.onEnterKeyDown}/>
    );
  }
}

class AddConstructButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  handleClickButton() {
    this.refs.addConstructDialog.show();
  }

  handleSubmit() {
    this.refs.addConstructDialog.dismiss();
    if (this.state.text) {
      addConstruct(this.state.text);
    }
  }

  handleInputChange({target}) {
    this.setState({
      text: target.value
    });
  }

  render() {
    const actions = [
      {
        text: 'Cancel'
      },
      {
        text: 'Submit',
        onTouchTap: this.handleSubmit.bind(this)
      }
    ];

    return (
      <div>
        <FloatingActionButton onClick={this.handleClickButton.bind(this)}>
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>
        <Dialog
            actions={actions}
            actionFocus="submit"
            title="Add construct"
            ref="addConstructDialog">
          <ConstructTextField
              onChange={this.handleInputChange.bind(this)}
              onEnterKeyDown={this.handleSubmit.bind(this)}/>
        </Dialog>
      </div>
    );
  }
}

export default AddConstructButton;
