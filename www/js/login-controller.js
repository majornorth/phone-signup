(function() {
  'use strict';

  angular
    .module('starter')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', '$ionicActionSheet', '$ionicModal', '$ionicLoading', 'loginService', 'CurrentUserId'];

  function LoginController($scope, $state, $ionicActionSheet, $ionicModal, $ionicLoading, loginService, CurrentUserId) {

    console.log(CurrentUserId);

    var vm = this;

    vm.sendConfirmationCode = sendConfirmationCode;
    vm.openCountrySelectorModal = openCountrySelectorModal;
    vm.verifyConfirmationCode = verifyConfirmationCode;
    vm.openActionSheetMenu = openActionSheetMenu;
    vm.updateSelectedCountry = updateSelectedCountry;
    vm.getFormattedNumber = loginService.getFormattedNumber;

    $scope.$on('$ionicView.beforeEnter', function() {
      vm.phonenumber = loginService.getPhonenumber();
      vm.country = loginService.getCountry();
    });

    /**
     * Calls the LoginService to send the confirmation code
     * to the phonenumber.
     * Once the server has sent the confirmation code, we redirect
     * the user to the "login-confirmation" to enter the confirmation code
     */
    function sendConfirmationCode() {
      showLoading('Sending code...');
      loginService.setPhonenumber(vm.phonenumber);
      loginService.sendConfirmationCode().then(function() {
        hideLoading();
        return $state.go('login-confirmation');
      });
    }

    /**
     * Calls the LoginService to verify the confirmation code
     * entered by the user
     * Once the server has validated the confirmation code, we redirect
     * the user to the "home" page
     */
    function verifyConfirmationCode() {
      $ionicLoading.show({
        template: 'Verifying code...'
      });
      loginService.verifyConfirmationCode(vm.confirmationCode)
        .then(function() {
          $ionicLoading.hide();
          vm.confirmationCode = '';
          if (CurrentUserId.exists === 'yes') {
            return $state.go('home');
          } else {
            return $state.go('create-profile');
          }
        },
        function() {
          $ionicLoading.hide();
          return $state.go('login');
        });
    }

    /**
     * Calls the LoginService to update the selected country.
     * We also update the current page with the new country prefix and pattern
     */
    function updateSelectedCountry(country) {
      vm.country = country;
      loginService.setCountry(country);
    }

    /**
     * Opens a regular ionic modal, the modal is loaded only once for performance purposes.
     * This modal allows the user to select another country.
     */
    function openCountrySelectorModal() {
      if ($scope.modal) {
        $scope.modal.show();
        return;
      }
      $ionicModal.fromTemplateUrl('views/login-country-selector.html', {
        scope: $scope,
        animation: 'none'
      }).then(function(modal) {
        $scope.modal = modal;
        var countries = loginService.getCountries();
        var countriesArr = [];
        for(var code in countries) {
            countriesArr.push(countries[code]);
        }
        $scope.countries = countriesArr;
        $scope.modal.show();
      });
      $scope.$on('$destroy', function() {
        if ($scope.modal) {
          $scope.modal.remove();
        }
      });
    }

    /**
     * Opens a regular ionic action sheet, it allows the user to change the phonenumber
     * or send a new code if he didn't received the first code.
     */
    function openActionSheetMenu() {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Resend SMS' },
          { text: 'Change phone number' },
        ],
        titleText: 'Didn\'t receive SMS?',
        cancelText: 'Cancel',
        cssClass: 'login-action-sheet',
        buttonClicked: function(index) {
          if (index === 0) {
            showLoading('Sending code...');
            loginService.sendConfirmationCode().then(function() {
              hideLoading();
            });
          }
          else if (index === 1) {
            loginService.setPhonenumber(null);
            $state.go('login');
          }
          return true;
        }
      });
    }

    //UTILS
    function showLoading(tpl) {
      $ionicLoading.show({
        template: tpl
      });
    }
    function hideLoading() {
      $ionicLoading.hide();
    }
  }
})();
