angular.module('starter')

.controller('ListSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    $scope.allDatas = [];
    $scope.transactions = [];
    $scope.userId = window.localStorage.getItem('UserId');
    $scope.search = {SearchDate : ''};

    function InitialListSO(){
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetSO';
      var data = {UserId:+$scope.userId};
      APIService.httpPost(url,data,
        function(response){
          APIService.HideLoading();
          if(response != null){
            $scope.allDatas = response.data;
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
      for (var i = 0; i <= $scope.transactions.length - 1; i++) {
        if($scope.transactions[i].id == id){
          $scope.transactions.splice(i, 1);
          break;
        }
      };
    }

    $scope.editSO = function(id){
      $state.go('app.saveoreditso',{id:id});
    };

    $scope.TimeChange = function(){
      var query = $scope.search.SearchDate.dateslashformat();
      //filter by createdate
      $scope.transactions =  [];
      for (var i = 0; i <= $scope.allDatas.length - 1; i++) {
        if($scope.allDatas[i].CreatedDateTxt.indexOf(query) >= 0) $scope.transactions.push($scope.allDatas[i]);
      };
    };

    $scope.clearFilter = function(){
      $scope.search.SearchDate = '';
      $scope.transactions = $scope.allDatas;
    };

  });
})
