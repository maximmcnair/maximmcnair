'use strict';

angular.module('maximmcnairApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/',
    { templateUrl: 'views/main.html'
    , controller: 'MainCtrl'
    })
  $routeProvider.when('/projects',
    { templateUrl: 'views/projects.html'
    , controller: 'ProjectsCtrl'
    })
  $routeProvider.when('/projects/:projectTitle',
    { templateUrl: 'views/project.html'
    , controller: 'ProjectCtrl'
    })
  $routeProvider.otherwise({redirectTo: '/'})
}])