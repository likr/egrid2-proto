import angular from 'angular';
import commonModules from '../common-modules';
import authModule from '../services/auth';

const template = `
<md-button class="md-icon-button" ui-sref="app.home">
  <md-icon>arrow_back</md-icon>
</md-button>

<form ng-submit="login.login()">
  <md-input-container>
    <label>email</label>
    <input type="text" ng-model="login.form.email"/>
  </md-input-container>
  <md-input-container>
    <label>password</label>
    <input type="password" ng-model="login.form.password"/>
  </md-input-container>
  <md-button class="md-raised md-primary">Login</md-button>
</form>
`;

const modName = 'egrid.components.login';

angular.module(modName, [
  commonModules,
  authModule
]);

angular.module(modName).factory('LoginController', ($state, Auth) => {
  return class LoginController {
    constructor() {
      this.form = {};
    }

    login() {
      Auth
        .$authWithPassword({
          email: this.form.email,
          password: this.form.password
        })
        .then(() => {
          $state.go('app.home', null, {reload: true});
        });
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.login', {
    url: '/login',
    views: {
      'content@app': {
        controllerAs: 'login',
        controllerProvider: (LoginController) => LoginController,
        template: template
      }
    }
  });
});

export default modName;
