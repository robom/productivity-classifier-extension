angular.module('productivity')
  .service('User', function ($http, RAILS) {
    var base;
    base = RAILS.HOST + "/extension_api/user";
    var auth_base = RAILS.HOST + "/oauth/";
    var auth = RAILS.HOST + "/oauth/authorize?response_type=code&client_id=" + RAILS.APPLICATION_ID

    return {
      all: function () {
        return $http.get(base + '/');
      },
      me: function () {
        return $http.get(base + '/profile');
      },
      logout: function () {
        return $http["delete"](base + '/logout');
      },
      new: function () {
        return {
          'email': 'lubosch@zoho.com',
          'password': 'aassdd',
          'grant_type': 'password'
        }
      },
      login: function (user) {
        return $http.post(auth_base + 'token',  user);
      }

    };
  });
