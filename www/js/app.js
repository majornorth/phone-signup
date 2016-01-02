// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'cwill747.phonenumber', 'firebase', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/app/intro');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home.html'
  }).state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  }).state('app.intro', {
    url: '/intro',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-intro.html',
        controller: 'IntroCtrl'
      }
    }
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
  }).state('edit-profile', {
    url: '/profile',
    templateUrl: 'views/edit-profile.html',
    controller: 'EditProfile.Controller'
  }).state('create-profile', {
    url: '/create-profile',
    templateUrl: 'views/create-profile.html',
    controller: 'CreateProfile.Controller'
  });
})


// Need to remove these defaults after development
.service('CurrentUserId', function() {
  return {
    phoneNumber: '%2B15157080626',
    exists: 'yes'
    // phoneNumber: '',
    // exists: ''
  }
})

.factory('CameraFactory', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

// This controls the walkthrough functionality
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('login');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

})

.controller('Sub.Controller', function($scope, $ionicModal, $firebaseArray, $state, CurrentUserId) {

  // Move three lines below into a service
  var usersRef = new Firebase('https://soccersubs.firebaseio.com/users/');
  var subs = $firebaseArray(usersRef);

  $scope.subs = subs;

  // Get current user number and remove url entity
  var number = CurrentUserId.phoneNumber;
  var onlyDigits = number.replace(/\D/g,'');
  var cleanNum = onlyDigits.substr(1);
  var userId = '+' + cleanNum;

  $scope.currentUserId = userId;

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

  $scope.viewUserProfile = function() {
    $state.go('profile');
  };
})

.controller('Profile.Controller', function($scope, $firebaseArray, $state, CurrentUserId) {
  $scope.goHome = function() {
    $state.go('home');
  };

  $scope.logUserOut = function() {
    $state.go('login');
  };

  $scope.editProfile = function() {
    $state.go('edit-profile');
  };


  // Move code for retrieving current user values into service
  var userId = CurrentUserId.phoneNumber;
  var userIdUrl = 'https://soccersubs.firebaseio.com/users/' + userId;
  var userRef = new Firebase(userIdUrl);

  userRef.on("value", function(snapshot) {
    var userValues = snapshot.val();
    $scope.userValues = userValues;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
})

.controller('EditProfile.Controller', function($scope, $firebaseArray, $state, CurrentUserId, CameraFactory) {
  $scope.backToProfile = function() {
    $state.go('profile');
  };

  // Move code for retrieving current user values into service
  var userId = CurrentUserId.phoneNumber;
  var userIdUrl = 'https://soccersubs.firebaseio.com/users/' + userId;
  var userRef = new Firebase(userIdUrl);

  userRef.on("value", function(snapshot) {
    var userValues = snapshot.val();
    $scope.userValues = userValues;
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  $scope.getPhoto = function() {
    CameraFactory.getPicture({
      quality: 100,
      targetWidth: 180,
      targetHeight: 180,
      saveToPhotoAlbum: false,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      cameraDirection: Camera.Direction.FRONT
    }).then(function(imageData) {
      userRef.update({
        photo: "data:image/jpeg;base64," + imageData
      });
    }, function(err) {
      console.err(err);
    });
  };

  $scope.positions = ['Defender', 'Midfielder','Winger','Striker','Goalkeeper'];

  $scope.selectedPosition = $scope.userValues.position;

  $scope.skills = ['Beginner', 'Recreational', 'Intermediate', 'Competitive', 'Division 1+'];

  $scope.selectedSkill = $scope.userValues.skill;

  $scope.firstName = $scope.userValues.firstName;

  $scope.lastName = $scope.userValues.lastName;

  $scope.updateProfile = function(selectedPosition, selectedSkill, firstName, lastName) {
    userRef.update({
      firstName: firstName,
      lastName: lastName,
      position: selectedPosition,
      skill: selectedSkill
    });
  };
})

.controller('CreateProfile.Controller', function($scope, $firebaseArray, $state, CurrentUserId, CameraFactory) {
  $scope.goHome = function() {
    $state.go('home');
  };

  $scope.logUserOut = function() {
    $state.go('login');
  };

  $scope.newUserObject = {
    firstName: '',
    lastName: '',
    photo: 'http://www.wallstreetotc.com/wp-content/uploads/2014/10/facebook-anonymous-app.jpg',
    position: '',
    skill: ''
  };

  var userId = CurrentUserId.phoneNumber;
  var userIdUrl = 'https://soccersubs.firebaseio.com/users/' + userId;
  var userRef = new Firebase(userIdUrl);

  $scope.getPhoto = function() {
    CameraFactory.getPicture({
      quality: 100,
      targetWidth: 180,
      targetHeight: 180,
      saveToPhotoAlbum: false,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      cameraDirection: Camera.Direction.FRONT
    }).then(function(imageData) {
      // userRef.update({
      //   photo: "data:image/jpeg;base64," + imageData
      // });

      $scope.newUserObject.photo = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      console.err(err);
    });
  };

  $scope.createUser = function() {
    var firstNameValue = $scope.newUserObject.firstName.trim();
    if (!firstNameValue.length) {
      return;
    }

    var firstNameValue = $scope.newUserObject.firstName;
    var lastNameValue = $scope.newUserObject.lastName;
    var skillValue = $scope.newUserObject.skill;
    var photoValue = $scope.newUserObject.photo;
    var positionValue = $scope.newUserObject.position;

    userRef.update({
      firstName: firstNameValue,
      lastName: lastNameValue,
      photo: photoValue,
      position: positionValue,
      skill: skillValue
    });

    $state.go('home');
  }
})
