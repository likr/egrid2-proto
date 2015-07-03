import angular from 'angular';
import angularfireModule from 'angularfire';
import uiRouterModule from 'angular-ui-router';
import participantListDirectiveModule from '../directives/participant-list';
import firebaseModule from '../services/firebase';
import openParticipantFormDialogModule from '../services/open-participant-form-dialog';
import rootRefModule from '../services/root-ref';

const template = `
<md-button class="md-icon-button" ui-sref="app.projects">
  <md-icon>arrow_back</md-icon>
</md-button>

<h2>{{projectDetail.project.name}}</h2>

<h3>{{'PARTICIPANT.PARTICIPANTS' | translate}}</h3>

<md-button class="md-raised md-primary" ng-click="projectDetail.openParticipantForm($event)">
  Add
</md-button>

<participant-list project="projectDetail.project" participants="projectDetail.participants"></participant-list>
`;

const modName = 'egrid.components.project-detail';

angular.module(modName, [
  angularfireModule,
  uiRouterModule,
  participantListDirectiveModule,
  firebaseModule,
  openParticipantFormDialogModule,
  rootRefModule
]);

angular.module(modName).factory('ProjectDetailController', (Firebase, openParticipantFormDialog) => {
  return class ProjectDetailController {
    constructor(project, participants) {
      this.project = project;
      this.participants = participants;
    }

    openParticipantForm($event) {
      openParticipantFormDialog($event)
        .then((form) => {
          this.participants.$add({
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
  $stateProvider.state('app.projects.detail', {
    url: '/{projectId}',
    views: {
      'content@app': {
        controllerAs: 'projectDetail',
        controllerProvider: (ProjectDetailController) => ProjectDetailController,
        template: template
      }
    },
    resolve: {
      project: ($stateParams, $firebaseObject, rootRef) => {
        const ref = rootRef
          .child('projects')
          .child($stateParams.userId)
          .child($stateParams.projectId);
        return $firebaseObject(ref).$loaded((data) => data);
      },
      participants: ($stateParams, $firebaseArray, rootRef) => {
        const ref = rootRef
          .child('participants')
          .child($stateParams.projectId);
        return $firebaseArray(ref).$loaded((data) => data);
      }
    }
  });
});

export default modName;
