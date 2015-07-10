import React from 'react';
import {Dialog, TextField} from 'material-ui';
import DialogStore from '../stores/dialog-store';

class ConstructTextField extends React.Component {
  componentDidMount() {
    React.findDOMNode(this).children[1].focus();
  }

  render() {
    return (
      <TextField
          defaultValue={this.props.defaultValue}
          hintText="Construct"
          fullWidth={true}
          onChange={this.props.onChange}
          onEnterKeyDown={this.props.onEnterKeyDown}/>
    );
  }
}

class ConstructDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      prevText: ''
    };
  }

  componentDidMount() {
    DialogStore.addRequestConstructDialogListener(this.handleRequestConstructDialog.bind(this));
  }

  componentDidUnmount() {
    DialogStore.removeRequestConstructDialogListener(this.handleRequestConstructDialog.bind(this));
  }

  handleRequestConstructDialog(callback, prevText, constructs) {
    this.setState({callback, prevText, constructs});
    this.refs.dialog.show();
  }

  handleSubmit() {
    this.refs.dialog.dismiss();
    if (this.state.text) {
      this.state.callback(this.state.text);
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
      <Dialog
          actions={actions}
          actionFocus="submit"
          title="Add construct"
          ref="dialog">
      <ConstructTextField
          defaultValue={this.state.prevText}
          onChange={this.handleInputChange.bind(this)}
          onEnterKeyDown={this.handleSubmit.bind(this)}/>
      </Dialog>
    );
  }
}

export default ConstructDialog;
