import angular from 'angular';
import angularfireModule from 'angularfire';
import uiRouterModule from 'angular-ui-router';
import projectListDirectiveModule from '../directives/project-list';
import firebaseModule from '../services/firebase';
import openProjectFormDialogModule from '../services/open-project-form-dialog';
import rootRefModule from '../services/root-ref';

const template = `
<md-button class="md-icon-button" ui-sref="app.home">
  <md-icon>arrow_back</md-icon>
</md-button>

<h2>{{'PROJECT.PROJECTS' | translate}}</h2>

<md-button class="md-raised md-primary" ng-click="projectList.openProjectForm($event)">
  Add
</md-button>

<project-list projects="projectList.projects"></project-list>
`;

const modName = 'egrid.components.project-list';

angular.module(modName, [
  angularfireModule,
  uiRouterModule,
  projectListDirectiveModule,
  firebaseModule,
  openProjectFormDialogModule,
  rootRefModule
]);

angular.module(modName).factory('ProjectListController', (Firebase, openProjectFormDialog) => {
  return class ProjectListController {
    constructor(projects) {
      this.projects = projects;
    }

    openProjectForm($event) {
      openProjectFormDialog($event)
        .then((form) => {
          this.projects.$add({
            name: form.name,
            note: form.note,
            created: Firebase.ServerValue.TIMESTAMP,
            updated: Firebase.ServerValue.TIMESTAMP
          });
        });
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.projects', {
    url: '/projects/{userId}',
    views: {
      'content@app': {
        controllerAs: 'projectList',
        controllerProvider: (ProjectListController) => ProjectListController,
        template: template
      }
    },
    resolve: {
      auth: (Auth) => {
        return Auth.$requireAuth();
      },
      user: ($stateParams, $firebaseObject, rootRef) => {
        const ref = rootRef
          .child('users')
          .child($stateParams.userId);
        return $firebaseObject(ref).$loaded((data) => data);
      },
      projects: ($stateParams, $firebaseArray, rootRef) => {
        const ref = rootRef
          .child('projects')
          .child($stateParams.userId);
        return $firebaseArray(ref).$loaded((data) => data);
      }
    }
  });
});

export default modName;
