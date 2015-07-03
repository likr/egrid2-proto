import angular from 'angular';
import angularfireModule from 'angularfire';
import uiRouterModule from 'angular-ui-router';
import rootRefModule from '../services/root-ref';

const modName = 'egrid.components.participant-interview';

const template = `
interview
`;

angular.module(modName, [
  angularfireModule,
  uiRouterModule,
  rootRefModule
]);

angular.module(modName).factory('ParticipantInterviewController', (Firebase, openParticipantFormDialog) => {
  return class ParticipantInterviewController {
    constructor(project, participant) {
      this.project = project;
      this.participant = participant;
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.projects.detail.participant.interview', {
    url: '/interview',
    views: {
      'content@app': {
        controllerAs: 'participantInterview',
        controllerProvider: (ParticipantInterviewController) => ParticipantInterviewController,
        template: template
      }
    },
    resolve: {
    }
  });
});

export default modName;
