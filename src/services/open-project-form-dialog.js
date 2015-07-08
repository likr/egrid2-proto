import angular from 'angular';
import materialModule from 'angular-material';

const template = `
<md-dialog flex="80">
  <md-dialog-content>
    <form ng-submit="projectForm.submit()">
      <md-input-container>
        <label>{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>
        <input type="text" ng-model="projectForm.form.name"/>
      </md-input-container>
      <md-input-container>
        <label>{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>
        <textarea rows="3" ng-model="projectForm.form.note"></textarea>
      </md-input-container>
    </form>
  </md-dialog-content>
  <div class="md-actions">
    <md-button ng-click="projectForm.cancel()">Cancel</md-button>
    <md-button class="md-raised md-primary" ng-click="projectForm.submit()">Submit</md-button>
  </div>
</md-dialog>
`;

const modName = 'egrid.services.open-project-form-dialog';

angular.module(modName, [materialModule]);

angular.module(modName).factory('ProjectFormController', () => {
  let dialog;
  return class ProjectFormController {
    constructor($mdDialog) {
      dialog = $mdDialog;
      this.form = {
        name: '',
        note: ''
      };
    }

    cancel() {
      dialog.cancel();
    }

    submit() {
      dialog.hide(this.form);
    }
  };
});

angular.module(modName).factory('openProjectFormDialog', ($mdDialog, ProjectFormController) => {
  const openProjectFormDialog = ($event) => {
    return $mdDialog
      .show({
        targetEvent: $event,
        controllerAs: 'projectForm',
        controller: ProjectFormController,
        template: template,
        clickOutsideToClose: true,
        onComplete: (_, element) => {
          element[0].getElementsByTagName('input')[0].focus();
        }
      });
  };
  return openProjectFormDialog;
});

export default modName;
