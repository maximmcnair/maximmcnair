angular.module('maximmcnairApp')
  .controller('ProjectCtrl', function ($scope, $routeParams, ProjectsFactory) {
    $scope.project = ProjectsFactory.getTask($routeParams.projectSlug)
  })