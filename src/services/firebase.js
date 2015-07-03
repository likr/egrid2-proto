import angular from 'angular';
import Firebase from 'Firebase';

const modName = 'egrid.services.firebase';

angular.module(modName, []).factory('Firebase', () => {
  return Firebase;
});

export default modName;
