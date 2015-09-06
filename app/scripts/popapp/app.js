"use strict";

var app;

// Declare app level module which depends on filters, and services
app = angular.module('productivity', [
  'public.ctrl.signIn',
  'ui.bootstrap',
  'angular-underscore',
  'ngStorage',
  'ui.router'
]);

app.constant('RAILS', {
  'HOST': 'http://localhost:3000',
  'APPLICATION_ID': '9516050e34caa1a21b121ff547d34732a99145cadd9ac95d9a37fe4153e2d17a',
  'REDIRECT_URI': 'http://localhost:3000/robots.txt'
});

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('tokenInterceptor');
  $httpProvider.responseInterceptors.push('unauthorizedInterceptor');
}]);

app.factory('tokenInterceptor', function (AccessToken, RAILS) {
  return {
    request: function (config) {
      var token;
      if (config.url.indexOf(RAILS.HOST) === 0) {
        token = AccessToken.get();
        if (token) {
          config.headers['Authorization'] = "Bearer " + token;
        }
      }
      return config;
    }
  };
});

app.factory('unauthorizedInterceptor', function ($q, $injector, AccessToken) {
  return function (promise) {
    var error, success;
    success = function (response) {
      return response;
    };
    error = function (response) {
      if (response.status === 401) {
        AccessToken["delete"]();
        $injector.get('$state').go('401');
      }
      return $q.reject(response);
    };
    return promise.then(success, error);
  };
});
