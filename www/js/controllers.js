angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, AuthService) {

  // Form data for the login modal
  $scope.loginData = {};

  $scope.isAuthen = AuthService.isAuthenticated();

  //if($scope.isAuthen) window.location = '#/app/home';

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
        $scope.closeLogin(); 
        $scope.isAuthen = true;
      },
      function(response){alert('username/password ผิดพลาด');});
  };

  $scope.logout = function(){
    AuthService.logout();
    $scope.isAuthen = false;
    window.location = '#/app/home';
  }

})
