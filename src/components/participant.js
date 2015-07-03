import angular from 'angular';
import uiRouterModule from 'angular-ui-router';

const modName = 'egrid.components.participant';

angular.module(modName, [uiRouterModule]);

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.project.detail.participant', {
    abstract: true,
    url: '/participants'
  });
});

export default modName;
