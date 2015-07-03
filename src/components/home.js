import angular from 'angular';
import uiRouterModule from 'angular-ui-router';

const modName = 'egrid.components.home';

const template = `
<div layout="row" layout-align="center">
  <md-button class="md-raised md-primary" ui-sref="app.project.list">
    Open Projects
  </md-button>
</div>
`;

angular.module(modName, [
  uiRouterModule
]);

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'content@app': {
        template: template
      }
    }
  });
});

export default modName;
