import angular from 'angular';
import routerModule from 'angular-ui-router';
import authModule from '../services/auth';

const modName = 'egrid.components.project';

angular.module(modName, [routerModule, authModule]);

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.project', {
    abstract: true,
    url: '/projects',
    resolve: {
      auth: ($firebaseAuth, Auth) => {
        return Auth.$requireAuth();
      }
    }
  });
});

export default modName;
