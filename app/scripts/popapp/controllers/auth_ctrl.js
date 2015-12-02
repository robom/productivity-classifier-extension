angular.module('public.ctrl.signIn', [])
  .controller('AuthCtrl', ['$scope', 'User', 'AccessToken', '$rootScope', '$location', function ($scope, User, AccessToken, $rootScope, $location) {
    $scope.user = User.new();
    var setLoggedIn;

    $scope.login = function () {
      User.login($scope.user).then(function (response) {
        AccessToken.set(response.data['access_token']);
        $location.path('/');
        return response.data;
      });
    };

    $scope.logout = function () {
      User.logout(AccessToken.get()).then(function (response) {
        AccessToken.delete();
        return response.data;
      });
    };

    setLoggedIn = function (isLoggedIn) {
      return $scope.loggedIn = !!isLoggedIn;
    };

    setLoggedIn(AccessToken.get());
    return $rootScope.$on('$stateChangeSuccess', function () {
      return setLoggedIn(AccessToken.get());
    });

  }]);



