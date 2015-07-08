import angular from 'angular';
import materialModule from 'angular-material';
import routerModule from 'angular-ui-router';

const template = `
<md-input-container class="md-icon-float" >
  <label>Search</label>
  <md-icon>search</md-icon>
  <input type="text" ng-model="participantList.filter.name">
</md-input-container>

<md-card ng-repeat="participant in participantList.participants | filter:participantList.filter | orderBy:'updated':true">
  <md-toolbar>
    <div class="md-toolbar-tools">
      <h3 class="md-title">
        <a ui-sref="app.projects.detail.participant.interview({participantId: participant.$id})">{{participant.name}}</a>
      </h3>
    </div>
  </md-toolbar>
  <md-card-content>
    <div>
      <span class="md-body-2">updated:</span> {{participant.updated | date:'yyyy/MM/dd HH:mm'}}
    </div>
    <div>
      <span class="md-body-2">note:</span> {{participant.note}}
    </div>
  </md-card-content>
  <div class="md-actions" layout="row" layout-align="end">
    <md-button ui-sref="app.projects.detail.participant({participantId: participant.$id})">Detail</md-button>
    <md-button ui-sref="app.projects.detail.participant.interview({participantId: participant.$id})">Interview</md-button>
  </div>
</md-card>
`;

const modName = 'egrid.directives.participant-list';

angular.module(modName, [materialModule, routerModule]);

angular.module(modName).factory('ParticipantListDirectiveController', () => {
  return class ParticipantListDirectiveController {
    constructor() {
      this.filter = {
        name: ''
      };
    }
  };
});

angular.module(modName).directive('participantList', (ParticipantListDirectiveController) => {
  return {
    restrict: 'E',
    template: template,
    scope: {
    },
    bindToController: {
      participants: '='
    },
    controllerAs: 'participantList',
    controller: ParticipantListDirectiveController
  };
});

export default modName;
