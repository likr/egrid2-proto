import angular from 'angular';
import uiRouterModule from 'angular-ui-router';

const modName = 'egrid.components.user';

angular.module(modName, [
  uiRouterModule
]);

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.user', {
    abstract: true,
    url: '/{userName}'
  });
});

export default modName;
