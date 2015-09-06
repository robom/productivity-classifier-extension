angular.module('public.ctrl.signIn', [])
  .controller('AuthCtrl', ['$scope', 'User', 'AccessToken', '$rootScope', function ($scope, User, AccessToken, $rootScope) {
    $scope.user = User.new();
    var setLoggedIn;

    $scope.login = function () {
      User.login($scope.user).then(function (response) {
        AccessToken.set(response.data['access_token']);
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



