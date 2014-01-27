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
  $routeProvider.otherwise({redirectTo: '/'})
}])