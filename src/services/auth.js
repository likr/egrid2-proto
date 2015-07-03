import angular from 'angular';
import angularfireModule from 'angularfire';
import rootRefModule from './root-ref';

const modName = 'egrid.services.auth';

angular.module(modName, [angularfireModule, rootRefModule]);

angular.module(modName).factory('Auth', ($firebaseAuth, rootRef) => {
  return $firebaseAuth(rootRef);
});

export default modName;
