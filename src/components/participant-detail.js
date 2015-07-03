import angular from 'angular';
import angularfireModule from 'angularfire';
import uiRouterModule from 'angular-ui-router';
import rootRefModule from '../services/root-ref';

const modName = 'egrid.components.participant-detail';

const template = `
<md-button class="md-icon-button" ui-sref="app.projects.detail">
  <md-icon>arrow_back</md-icon>
</md-button>

<h2>{{participantDetail.participant.name}}</h2>

<md-button ui-sref="app.projects.detail.participant.interview">
  Interview
</md-button>
`;

angular.module(modName, [
  angularfireModule,
  uiRouterModule,
  rootRefModule
]);

angular.module(modName).factory('ParticipantDetailController', (Firebase, openParticipantFormDialog) => {
  return class ParticipantDetailController {
    constructor(project, participant) {
      this.project = project;
      this.participant = participant;
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.projects.detail.participant', {
    url: '/participants/{participantId}',
    views: {
      'content@app': {
        controllerAs: 'participantDetail',
        controllerProvider: (ParticipantDetailController) => ParticipantDetailController,
        template: template
      }
    },
    resolve: {
      participant: ($stateParams, $firebaseObject, rootRef) => {
        const ref = rootRef
          .child('participants')
          .child($stateParams.projectId)
          .child($stateParams.participantId);
        return $firebaseObject(ref).$loaded((data) => data);
      }
    }
  });
});

export default modName;
