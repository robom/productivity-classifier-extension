angular.module('productivity')
  .service('AccessToken', function ($localStorage, $timeout) {
    return {
      get: function () {
        return $localStorage.token;
      },
      set: function (token) {
        return $localStorage.token = token;
      },
      "delete": function () {
        return delete $localStorage.token;
      }
    };
  });