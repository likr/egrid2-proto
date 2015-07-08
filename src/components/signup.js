import angular from 'angular';
import angularfireModule from 'angularfire';
import ngMessagesModule from 'angular-messages';
import commonModules from '../common-modules';
import authModule from '../services/auth';
import firebaseModule from '../services/firebase';
import rootRefModule from '../services/root-ref';

const template = `
<md-button class="md-icon-button" ui-sref="app.home">
  <md-icon>arrow_back</md-icon>
</md-button>

<form ng-submit="signup.signup()" novalidate>
  <md-input-container>
    <label>User ID</label>
    <input type="text" ng-model="signup.form.userId" required/>
    <div ng-messages="signup.errors.userId">
      <div ng-message="unique">Already used.</div>
      <div ng-message="pattern">Contains invalid characters.</div>
    </div>
  </md-input-container>
  <md-input-container>
    <label>email</label>
    <input type="email" ng-model="signup.form.email" required/>
    <div ng-messages="signup.errors.email">
      <div ng-message="unique">Already used.</div>
    </div>
  </md-input-container>
  <md-input-container>
    <label>password</label>
    <input type="password" ng-model="signup.form.password" required/>
  </md-input-container>
  <md-button class="md-raised md-primary">Sign Up</md-button>
</form>
`;

const modName = 'egrid.components.signup';

angular.module(modName, [
  angularfireModule,
  ngMessagesModule,
  commonModules,
  authModule,
  firebaseModule,
  rootRefModule
]);

angular.module(modName).factory('SignupController', ($q, $state, $firebaseArray, $firebaseObject, Auth, Firebase, rootRef) => {
  const emailUnique = (email) => {
    const ref = rootRef
      .child('users')
      .orderByChild('email')
      .equalTo(email);
    return $firebaseArray(ref).$loaded((data) => {
      if (data.length > 0) {
        const error = new Error('email already used');
        return $q.reject(error);
      }
      return data;
    });
  };

  const userIdValid = (userId) => {
    const deferred = $q.defer();
    if (userId.match(/^[a-zA-Z0-9]+$/)) {
      deferred.resolve(true);
    } else {
      deferred.reject(false);
    }
    return deferred.promise;
  };

  const userIdUnique = (userId) => {
    const ref = rootRef
      .child('users')
      .child(userId);
    return $firebaseObject(ref).$loaded((data) => {
      if (data.$value !== null) {
        const error = new Error('userId already used');
        return $q.reject(error);
      }
      return data;
    });
  };

  return class SignupController {
    constructor() {
      this.form = {};
      this.errors = {
        userId: {
          unique: false
        },
        email: {
          unique: false
        }
      };
    }

    signup() {
      const {userId, email, password} = this.form;
      const emailChecked = emailUnique(email)
        .then((data) => {
          this.errors.email.unique = false;
          return data;
        }, (error) => {
          this.errors.email.unique = true;
          return $q.reject(error);
        });
      const userIdChecked = userIdValid(userId)
        .then(() => {
          this.errors.userId.pattern = false;
          return userIdUnique(userId)
            .then((data) => {
              this.errors.userId.unique = false;
              return data;
            }, (error) => {
              this.errors.userId.unique = true;
              return $q.reject(error);
            });
        }, () => {
          this.errors.userId.pattern = true;
          this.errors.userId.unique = false;
          return $q.reject();
        });

      $q.all([emailChecked, userIdChecked])
        .then(() => Auth.$createUser({email, password}))
        .then(() => Auth.$authWithPassword({email, password}))
        .then(({uid}) => {
          const ref = rootRef.child('users').child(userId);
          const user = $firebaseObject(ref);
          user.uid = uid;
          user.email = email;
          user.created = Firebase.ServerValue.TIMESTAMP;
          user.updated = Firebase.ServerValue.TIMESTAMP;
          return user.$save();
        })
        .then(() => {
          $state.go('app.home', null, {reload: true});
        }, (error) => {
          console.log(error);
        });
    }
  };
});

angular.module(modName).config(($stateProvider) => {
  $stateProvider.state('app.signup', {
    url: '/signup',
    views: {
      'content@app': {
        controllerAs: 'signup',
        controllerProvider: (SignupController) => SignupController,
        template: template
      }
    }
  });
});

export default modName;
