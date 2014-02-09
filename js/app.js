'use strict';

angular.module('maximmcnairApp', [
  'ngSanitize',
  'ngRoute'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/',
    { templateUrl: '/views/main.html'
    , controller: 'MainCtrl'
    })
  $routeProvider.when('/projects/',
    { templateUrl: '/views/projects.html'
    , controller: 'ProjectsCtrl'
    })
  $routeProvider.when('/projects/:projectSlug/',
    { templateUrl: '/views/project.html'
    , controller: 'ProjectCtrl'
    })
  $routeProvider.otherwise({redirectTo: '/'})
  $locationProvider.html5Mode(true)
}])