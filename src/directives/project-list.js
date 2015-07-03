import angular from 'angular';
import materialModule from 'angular-material';
import routerModule from 'angular-ui-router';

const template = `
<md-input-container class="md-icon-float" >
  <label>Search</label>
  <md-icon>search</md-icon>
  <input type="text" ng-model="projectList.filter.name">
</md-input-container>

<md-card ng-repeat="project in projectList.projects | filter:projectList.filter | orderBy:'updated':true">
  <md-toolbar>
    <div class="md-toolbar-tools">
      <h3 class="md-title">
        <a ui-sref="app.projects.detail({projectId: project.$id})">{{project.name}}</a>
      </h3>
    </div>
  </md-toolbar>
  <md-card-content>
    <div>
      <span class="md-body-2">updated:</span> {{project.updated | date:'yyyy/MM/dd HH:mm'}}
    </div>
    <div>
      <span class="md-body-2">note:</span> {{project.note}}
    </div>
  </md-card-content>
  <div class="md-actions" layout="row" layout-align="end">
    <md-button class="md-primary" ui-sref="app.projects.detail({projectId: project.$id})">
      Open
    </md-button>
  </div>
</md-card>
`;

const modName = 'egrid.directives.project-list';

angular.module(modName, [materialModule, routerModule]);

angular.module(modName).factory('ProjectListDirectiveController', () => {
  return class ProjectListDirectiveController {
    constructor() {
      this.filter = {
        name: ''
      };
    }
  };
});

angular.module(modName).directive('projectList', (ProjectListDirectiveController) => {
  return {
    restrict: 'E',
    template: template,
    scope: {
    },
    bindToController: {
      projects: '='
    },
    controllerAs: 'projectList',
    controller: ProjectListDirectiveController
  };
});

export default modName;
