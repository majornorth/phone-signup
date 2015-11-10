// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'cwill747.phonenumber', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home.html'
  }).state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginController as vm'
  }).state('login-confirmation', {
    url: '/login-confirmation',
    templateUrl: 'views/login-confirmation.html',
    controller: 'LoginController as vm'
  }).state('tos', {
    url: '/tos',
    templateUrl: 'views/tos.html'
  }).state('privacy', {
    url: '/privacy',
    templateUrl: 'views/privacy.html'
  }).state('profile', {
    url: '/profile',
    templateUrl: 'views/profile.html',
    controller: 'Profile.Controller'
  });
})

.controller('Sub.Controller', function($scope, $ionicModal, $firebaseArray, $state) {
  // Create modal
  $ionicModal.fromTemplateUrl('new-message.html', function(modal) {
    $scope.messageModal = modal;
  }, {
    scope: $scope
  });

  $scope.createMessage = function(message) {
    if(!message) {
      return;
    }

    var smsRef = new Firebase('https://soccersubs.firebaseio.com/sms/');
    var smsQueue = $firebaseArray(smsRef);

    smsQueue.$add({
      name: 'Stewart',
      phone: '15157080626',
      text: message
    });

    $scope.messageModal.hide();

    message.content = "";
  };


  $scope.newMessage = function() {
    $scope.messageModal.show();
  };

  $scope.closeNewMessage = function() {
    $scope.messageModal.hide();
  }

  $scope.logUserOut = function() {
    $state.go('login');
  };

  $scope.viewUserProfile = function() {
    $state.go('profile');
  };
})

.controller('Profile.Controller', function($scope, $firebaseArray, $state) {
  $scope.goHome = function() {
    $state.go('home');
  };
})
