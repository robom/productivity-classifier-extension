angular.module('productivity')
  .controller('ExperimentCtrl', ['$scope', '$http', 'RAILS', function ($scope, $http, RAILS) {
    $scope.welcomeMsg = "This is your first chrome extension";

    $scope.in_work = function () {
      var url = RAILS.HOST + "/extension_api/experiments/in_work";
      $http.post(url, {}).success(function () {
        $scope.experiment_complete = true;
      });
    };

    $scope.not_in_work = function () {
      var url = RAILS.HOST + "/extension_api/experiments/not_in_work";
      $http.post(url, {}).success(function () {
        $scope.experiment_complete = true;
      });
    };
  }])
;
