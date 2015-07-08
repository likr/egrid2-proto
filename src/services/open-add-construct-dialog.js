import angular from 'angular';
import materialModule from 'angular-material';

const template = `
<md-dialog flex="80">
  <md-dialog-content>
    <form ng-submit="constructForm.submit()">
      <md-input-container>
        <label>Construct</label>
        <input type="text" ng-model="constructForm.form.text"/>
      </md-input-container>
    </form>
    <md-list style="height: 500px; overflow-y: scroll">
      <md-list-item
          ng-repeat="construct in constructForm.constructs | filter:constructForm.form.text"
          ng-click="constructForm.form.text = construct; constructForm.submit()">
        {{construct}}
      </md-list-item>
    </md-list>
  </md-dialog-content>
  <div class="md-actions">
    <md-button ng-click="constructForm.cancel()">Cancel</md-button>
    <md-button class="md-raised md-primary" ng-click="constructForm.submit()">Submit</md-button>
  </div>
</md-dialog>
`;

const modName = 'egrid.services.open-construct-form-dialog';

angular.module(modName, [materialModule]);

angular.module(modName).factory('ConstructFormController', () => {
  let dialog;
  return class ConstructFormController {
    constructor($mdDialog) {
      dialog = $mdDialog;
      this.form = {
        text: this.text
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

angular.module(modName).factory('openConstructFormDialog', ($mdDialog, ConstructFormController) => {
  const openConstructFormDialog = ($event, text='', constructs=null) => {
    return $mdDialog
      .show({
        targetEvent: $event,
        locals: {
          text,
          constructs
        },
        bindToController: true,
        controllerAs: 'constructForm',
        controller: ConstructFormController,
        template: template,
        clickOutsideToClose: true,
        onComplete: (_, element) => {
          element[0].getElementsByTagName('input')[0].focus();
        }
      });
  };
  return openConstructFormDialog;
});

export default modName;
