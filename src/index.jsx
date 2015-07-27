/* global document*/
import 'whatwg-fetch';
import React from 'react';
import App from './containers/app';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

React.render(<App/>, document.getElementById('content'));
