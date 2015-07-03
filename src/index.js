import angular from 'angular';
import router from 'angular-ui-router';
import translate from 'angular-translate';
import translateLoader from 'angular-translate-loader-static-files';
import components from './components';

const modName = 'egrid';

angular.module(modName, [router, translate, components]);

angular.module(modName).config(($urlRouterProvider) => {
  $urlRouterProvider.otherwise('/app/home');
});

angular.module(modName).config(($translateProvider) => {
  $translateProvider
    .useSanitizeValueStrategy('escape')
    .useStaticFilesLoader({
      prefix: 'locations/',
      suffix: '.json'
    })
    .fallbackLanguage("en")
    .preferredLanguage("ja");
});

angular.module(modName).run(($rootScope, $state) => {
  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    if (error === 'AUTH_REQUIRED') {
      $state.go('app.login');
    }
  });
});
