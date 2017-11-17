angular.module('starter')

.controller('ChangePasswordCtrl', function($scope, APIService, $ionicPopup, $ionicPlatform) {
  $ionicPlatform.ready(function() {
     
    $scope.changePassword = {};

    $scope.doChangePassword = function()
    {
      if(!CheckValidate()) return;
      if(!confirm('ต้องการเปลี่ยนรหัสผ่านใหม่ ?')) return;
      //todo post to change password
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/ChangePassword';
      var data = {UserId: window.localStorage.getItem('UserId'), OldPassword: $scope.changePassword.oldpassword, NewPassword: $scope.changePassword.newpassword};
      APIService.httpPost(url,data,
        function(response){
          console.log(response);
          APIService.HideLoading();
          if(response != null){
            if(response.data.success) IonicAlert($ionicPopup, response.data.message, function(){
              //log out
              $scope.logout();
            });
            else IonicAlert($ionicPopup, response.data.message, null);
          }
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
        })
    }

    function CheckValidate() {
      console.log($scope.changePassword);
      if(!$scope.changePassword.oldpassword || $scope.changePassword.oldpassword.length == 0 || !$scope.changePassword.newpassword || $scope.changePassword.newpassword.length == 0) 
      {
        IonicAlert($ionicPopup,"รหัสผ่านเก่า/รหัสผ่านใหม่ ห้ามเป็นค่าว่าง",null);
        return false;
      }
      return true;
    }

  });

})
