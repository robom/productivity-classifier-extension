angular.module('productivity')
    .directive('userProfile', function() {
        return {
            restrict: 'A',
            //template: '<h1>Hey! {{welcomeMsg}} good</h1>'
            templateUrl: '/scripts/popapp/views/user_profile.html'
        };
    });