angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, AuthService, APIService, $ionicHistory, $ionicPopup) {
  //version
  $scope.version = '1.3';

  // Form data for the login modal
  $scope.loginData = {};

  $scope.isAuthen = AuthService.isAuthenticated();

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    AuthService.login($scope.loginData.username,$scope.loginData.password).then(
      function(response){
        if(response) {
          $scope.isAuthen = true;
          $scope.closeLogin();
        } 
        else IonicAlert($ionicPopup,"username/password ผิด",null);
      },
      function(error){IonicAlert($ionicPopup, error, null);});
  };

  $scope.logout = function(){
    AuthService.logout();
    $scope.isAuthen = false;
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $scope.loginData.username = '';
    $scope.loginData.password = '';
    window.location = '#/app/home';
  }

})
