import angular from 'angular';
import angularfireModule from 'angularfire';
import shinsekaiModule from 'shinsekai';
import commonModules from '../common-modules';
import openAddConstructDialogModule from '../services/open-add-construct-dialog';
import rootRefModule from '../services/root-ref';

const template = `
<div style="position: absolute; left: 0; right: 0; top: 64px; bottom: 5px;">
  <svg width="100%" height="100%">
    <text ng-repeat="vertex in participantInterview.vertices" ss-y="20 * $index + 50">{{vertex.text}}</text>
  </svg>
</div>
<div style="position: absolute; left: 0; top: 64px;" layout="column">
  <md-button class="md-icon-button" ui-sref="app.projects.detail.participant">
    <md-icon>arrow_back</md-icon>
  </md-button>
</div>
<div style="position: absolute; right: 0; top: 64px;" layout="column">
  <md-button class="md-icon-button" ng-click="participantInterview.openConstructForm($event)">
    <md-icon>add</md-icon>
  </md-button>
</div>
`;

const modName = 'egrid.components.participant-interview';

angular.module(modName, [
  angularfireModule,
  shinsekaiModule,
  commonModules,
  openAddConstructDialogModule,
  rootRefModule
]);

angular.module(modName).factory('ParticipantInterviewController', ($firebaseObject, openConstructFormDialog) => {
  return class ParticipantInterviewController {
    constructor(participant, vertices, edges) {
      this.participant = participant;
      this.vertices = vertices;
      this.edges = edges;
    }

    openConstructForm($event) {
      openConstructFormDialog($event, this.vertices)
        .then((form) => {
          const ref = this.vertices.$ref().child(form.text);
          $firebaseObject(ref)
            .$loaded((data) => {
              if (data.$value === null) {
                data.text = form.text;
                data.participants = {
                  [this.participant.$id]: true
                };
              } else {
                data.participants[this.participant.$id] = true;
              }
              data.$save();
            });
        });
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.projects.detail.participant.interview', {
    url: '/interview',
    views: {
      'base@app': {
        controllerAs: 'participantInterview',
        controllerProvider: (ParticipantInterviewController) => ParticipantInterviewController,
        template: template
      }
    },
    resolve: {
      vertices: ($stateParams, $firebaseArray, rootRef) => {
        const ref = rootRef
          .child('vertices')
          .child($stateParams.projectId);
        return $firebaseArray(ref).$loaded((data) => data);
      },
      edges: ($stateParams, $firebaseArray, rootRef) => {
        const ref = rootRef
          .child('edges')
          .child($stateParams.projectId);
        return $firebaseArray(ref).$loaded((data) => data);
      }
    }
  });
});

export default modName;
