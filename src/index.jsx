/* global document*/
import React from 'react';
import Main from './main';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

React.render(<Main/>, document.getElementById('content'));
