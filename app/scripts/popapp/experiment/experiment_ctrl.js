angular.module('productivity')
  .controller('ExperimentCtrl', ['$scope', '$http', 'RAILS', function ($scope, $http, RAILS) {
    $scope.welcomeMsg = "This is your first chrome extension";

    $scope.experiment_link = RAILS.HOST + '/experiments';

    var get_beers_count = function() {
      var url = RAILS.HOST + "/extension_api/experiments/beer_count.json";
      $http.get(url, {}).success(function (data) {
        $scope.beers_count = data['beer_count'];
      });
    };

    $scope.beers_count = get_beers_count();

    $scope.in_work = function () {
      var url = RAILS.HOST + "/extension_api/experiments/in_work.json";
      $http.post(url, {}).success(function () {
        $scope.experiment_complete = true;
      });
    };

    $scope.not_in_work = function () {
      var url = RAILS.HOST + "/extension_api/experiments/not_in_work.json";
      $http.post(url, {}).success(function () {
        $scope.experiment_complete = true;
      });
    };
  }])
;
