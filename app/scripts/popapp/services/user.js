angular.module('productivity')
  .service('User', function ($http, RAILS) {
    var base;
    base = RAILS.HOST + "/extension_api/user";
    var auth_base = RAILS.HOST + "/oauth/";

    return {
      all: function () {
        return $http.get(base + '/');
      },
      me: function () {
        return $http.get(base + '/profile');
      },
      logout: function (token) {
        return $http.post(auth_base + 'revoke', {token: token});
      },
      new: function () {
        return {
          'email': '',
          'password': '',
          'grant_type': 'password'
        }
      },
      login: function (user) {
        return $http.post(auth_base + 'token',  user);
      }

    };
  });
