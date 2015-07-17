import React from 'react';
import {SelectField} from 'material-ui';
import {setLayoutOptions} from '../app-actions';

class LayoutOptionsForm extends React.Component {
  handleChangeLayerMargin(e) {
    setLayoutOptions({
      layerMargin: e.target.value.payload
    });
  }

  handleChangeLayout(e) {
    setLayoutOptions({
      boxLayout: e.target.value.payload === 'box'
    });
  }

  render() {
    return (
      <form>
        <SelectField
            onChange={this.handleChangeLayout.bind(this)}
            value={'point'}
            hintText="Layout"
            menuItems={[{payload: 'box', text: 'Box layout'}, {payload: 'point', text: 'Point layout'}]}/>
        <SelectField
            onChange={this.handleChangeLayerMargin.bind(this)}
            value={30}
            hintText="Layer margin"
            menuItems={[{payload: 30, text: 30}, {payload: 150, text: 150}]}/>
      </form>
    );
  }
}

export default LayoutOptionsForm;
