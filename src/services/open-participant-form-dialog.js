import angular from 'angular';
import materialModule from 'angular-material';

const template = `
<md-dialog flex="80">
  <md-dialog-content>
    <form ng-submit="participantForm.submit()">
      <md-input-container>
        <label>{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>
        <input type="text" ng-model="participantForm.form.name"/>
      </md-input-container>
      <md-input-container>
        <label>{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>
        <textarea rows="3" ng-model="participantForm.form.note"></textarea>
      </md-input-container>
    </form>
  </md-dialog-content>
  <div class="md-actions">
    <md-button ng-click="participantForm.cancel()">Cancel</md-button>
    <md-button class="md-raised md-primary" ng-click="participantForm.submit()">Submit</md-button>
  </div>
</md-dialog>
`;

const modName = 'egrid.services.open-participant-form-dialog';

angular.module(modName, [materialModule]);

angular.module(modName).factory('ParticipantFormController', () => {
  let dialog;
  return class ParticipantFormController {
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

angular.module(modName).factory('openParticipantFormDialog', ($mdDialog, ParticipantFormController) => {
  const openParticipantFormDialog = ($event) => {
    return $mdDialog
      .show({
        targetEvent: $event,
        controllerAs: 'participantForm',
        controller: ParticipantFormController,
        template: template,
        clickOutsideToClose: true
      });
  };
  return openParticipantFormDialog;
});

export default modName;
