import angular from 'angular';
import app from './app';
import home from './home';
import login from './login';
import project from './project';
import projectList from './project-list';
import projectDetail from './project-detail';
import participant from './participant';
import participantDetail from './participant-detail';
import participantInterview from './participant-interview';

const modName = 'egrid.components';

angular.module(modName, [
  app,
  home,
  login,
  project,
  projectList,
  projectDetail,
  participant,
  participantDetail,
  participantInterview
]);

export default modName;
