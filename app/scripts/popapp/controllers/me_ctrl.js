angular.module('productivity')
  .controller('MeCtrl', function ($scope, user) {
    return $scope.user = user;
  });