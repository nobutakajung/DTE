angular.module('starter')

.controller('ListSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    $scope.transactions = [];
    $scope.userId = window.localStorage.getItem('UserId');

    function InitialListSO(){
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetSO';
      var data = {UserId:+$scope.userId};
      APIService.httpPost(url,data,
        function(response){
          APIService.HideLoading();
          if(response != null){
            $scope.transactions = response.data;
          }
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
        })
    }

    InitialListSO();

    $scope.DeleteSO = function(id){
      if(confirm('ต้องการลบ SO นี้?')){
        APIService.ShowLoading();
        var url = APIService.hostname() + '/SO/DeleteSO';
        var data = {Id:id};
        APIService.httpPost(url,data,
          function(response){
            if(response != null && response.data) RemoveSO(id);
            APIService.HideLoading();
          },function(error){
            APIService.HideLoading();
          })
      }
    }

    function RemoveSO(id) {
      var index = 0;
      for (var i = 0; i <= $scope.transactions.length - 1; i++) {
        if($scope.transactions[i].id == id){
          $scope.transactions.splice($scope.transactions[i],1);
          break;
        }
      };
    }

  });
})
