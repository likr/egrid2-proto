import angular from 'angular';
import firebaseModule from './firebase';

const modName = 'egrid.services.root-ref';

angular.module(modName, [firebaseModule]);

angular.module(modName).factory('rootRef', (Firebase) => {
  return new Firebase('https://egrid.firebaseio.com/');
});

export default modName;
