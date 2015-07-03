import angular from 'angular';
import materialModule from 'angular-material';
import uiRouterModule from 'angular-ui-router';
import authModule from '../services/auth';

const modName = 'egrid.components.app';

const template = `
<md-toolbar>
  <div class="md-toolbar-tools">
    <h2>
      <span><a ui-sref="app.home">E-Grid</a></span>
    </h2>
    <span flex></span>
    <md-button ng-if="!app.loginUser" ui-sref="app.login">Login</md-button>
    <md-menu ng-if="app.loginUser">
      <md-button ng-click="$mdOpenMenu()">
        User Info
        <md-icon md-menu-origin>menu</md-icon>
      </md-button>
      <md-menu-content>
        <md-menu-item>
          <p>{{app.loginUser.password.email}}</p>
        </md-menu-item>
        <md-menu-item>
          <md-button ng-click="app.logout()">Logout</md-button>
        </md-menu-item>
      </md-menu-content>
    </md-menu>
  </div>
</md-toolbar>
<md-content class="md-padding">
  <div ui-view="content"></div>
</md-content>
`;

angular.module(modName, [
  uiRouterModule,
  materialModule,
  authModule
]);

angular.module(modName).factory('AppController', ($state, Auth) => {
  return class AppController {
    constructor() {
      Auth.$onAuth((authData) => {
        this.loginUser = authData;
      });
    }

    logout() {
      Auth.$unauth();
      $state.go('app.login');
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app', {
    abstract: true,
    url: '/app',
    views: {
      'base@': {
        controllerAs: 'app',
        controllerProvider: (AppController) => AppController,
        template: template
      }
    },
    resolve: {
      auth: (Auth) => {
        return Auth.$waitForAuth();
      }
    }
  });
});

export default modName;
