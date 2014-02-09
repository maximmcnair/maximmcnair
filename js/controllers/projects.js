'use strict';

angular.module('maximmcnairApp')
  .controller('ProjectsCtrl', function ($scope, ProjectsFactory) {
    $scope.projects = ProjectsFactory.get()
    console.log($scope.projects)
  })