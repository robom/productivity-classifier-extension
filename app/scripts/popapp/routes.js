angular.module('productivity')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(function () {
      return '/'
    });

    $stateProvider.state('index', {
      url: '/',
      controller: function ($state, AccessToken) {
        if (AccessToken.get()) {
          return $state.go('experiment');
        }else{
          return $state.go('login');
        }
      },
      templateUrl: '/scripts/popapp/views/index.html'
    });

    $stateProvider.state('dashboard', {
      url: '/dashboard',
      controller: 'DashboardCtrl',
      templateUrl: '/scripts/popapp/views/index.html'
    });

    $stateProvider.state('experiment', {
      url: '/experiment',
      controller: 'ExperimentCtrl',
      templateUrl: '/scripts/popapp/experiment/experiment.html'
    });

    $stateProvider.state('me', {
      url: '/me',
      controller: 'MeCtrl',
      resolve: {
        user: function (User) {
          return User.me().then(function (response) {
            return response.data;
          });
        }
      },
      templateUrl: '/scripts/popapp/views/me.html'
    });
    $stateProvider.state('login', {
      url: '/login',
      controller: 'AuthCtrl',
      templateUrl: '/scripts/popapp/views/login.html'

    });
    return $stateProvider.state('401', {
      url: '/unauthorized',
      controller: function ($state, AccessToken) {
        if (AccessToken.get()) {
          return $state.go('index');
        }
      },
      templateUrl: '/scripts/popapp/views/401.html'
    });
  });

