/* global FileReader */
import React from 'react';
import {Dialog} from 'material-ui';

class FileInputDialog extends React.Component {
  render() {
    const actions = [
      {text: 'Cancel', onTouchTap: ::this.handleClickCancel},
      {text: 'Load', onTouchTap: ::this.handleClickSubmit}
    ];
    return (
      <Dialog
          ref="dialog"
          title="Select File"
          actions={actions}>
        <input type="file" ref="fileInput"/>
      </Dialog>
    );
  }

  handleClickCancel() {
    this.refs.dialog.dismiss();
  }

  handleClickSubmit() {
    this.refs.dialog.dismiss();
    const files = this.refs.fileInput.getDOMNode().files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.props.callback(e.target.result);
      };
      reader.readAsText(files[0]);
    }
  }

  show() {
    this.refs.dialog.show();
  }
}

export default FileInputDialog;
