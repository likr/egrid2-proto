import angular from 'angular';
import commonModules from '../common-modules';

const modName = 'egrid.components.home';

const template = `
<div ng-if="home.loginUser" layout="row" layout-align="center">
  <md-button class="md-raised md-primary" ui-sref="app.projects({userId: home.loginUser.$id})">
    Open Projects
  </md-button>
</div>
<div ng-if="!home.loginUser" layout="row" layout-align="center">
  <md-button class="md-raised" ui-sref="app.login">
    Login
  </md-button>
  <md-button class="md-raised md-primary" ui-sref="app.signup">
    Sign Up
  </md-button>
</div>
`;

angular.module(modName, [
  commonModules
]);

angular.module(modName).factory('HomeController', () => {
  return class HomeController {
    constructor(loginUser) {
      this.loginUser = loginUser;
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.home', {
    url: '/home',
    views: {
      'content@app': {
        controllerAs: 'home',
        controllerProvider: (HomeController) => HomeController,
        template: template
      }
    }
  });
});

export default modName;
