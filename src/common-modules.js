import angular from 'angular';
import materialModule from 'angular-material';
import translateModule from 'angular-translate';
import uiRouterModule from 'angular-ui-router';
import 'angular-translate-loader-static-files';

const modName = 'egrid.common-modules';

angular.module(modName, [
  materialModule,
  translateModule,
  uiRouterModule
]);

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

export default modName;
