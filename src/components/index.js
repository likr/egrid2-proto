import angular from 'angular';
import app from './app';
import home from './home';
import signup from './signup';
import login from './login';
import projectList from './project-list';
import projectDetail from './project-detail';
import participantDetail from './participant-detail';
import participantInterview from './participant-interview';

const modName = 'egrid.components';

angular.module(modName, [
  app,
  home,
  signup,
  login,
  projectList,
  projectDetail,
  participantDetail,
  participantInterview
]);

export default modName;
