import angular from 'angular';
import commonModules from '../common-modules';
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
          <p>{{app.loginUser.email}}</p>
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
  commonModules,
  authModule
]);

angular.module(modName).factory('AppController', ($state, Auth) => {
  return class AppController {
    constructor(loginUser) {
      this.loginUser = loginUser;
    }

    logout() {
      Auth.$unauth();
      $state.go('app.login', null, {reload: true});
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
      loginUser: ($firebaseArray, Auth, rootRef) => {
        return Auth.$waitForAuth()
          .then((user) => {
            if (user === null) {
              return null;
            }
            const ref = rootRef
              .child('users')
              .orderByChild('email')
              .equalTo(user.password.email);
            return $firebaseArray(ref).$loaded((data) => data[0]);
          });
      }
    }
  });
});

export default modName;
