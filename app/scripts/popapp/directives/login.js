angular.module('productivity')
    .directive('loginDirective', function() {
        return {
            restrict: 'A',
            //template: '<h1>Hey! {{welcomeMsg}} good</h1>'
            templateUrl: '/scripts/popapp/views/login.html'
        };
    });