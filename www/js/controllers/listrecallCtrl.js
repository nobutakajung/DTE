angular.module('starter')

.controller('ListRecallCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    $scope.allDatas = [];
    $scope.transactions = [];
    $scope.userId = GetUserId();
    $scope.station = GetUserStation();
    $scope.search = {SearchDate : ''};

    function InitialListRecall(){
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetTempSO';
      var data = {Station:$scope.station};
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

    InitialListRecall();

    $scope.DeleteRecall = function(id){
      if(confirm('ต้องการลบ Recall นี้?')){
        APIService.ShowLoading();
        var url = APIService.hostname() + '/SO/DeleteTempSO';
        var data = {Id:id};
        APIService.httpPost(url,data,
          function(response){
            if(response != null && response.data) RemoveRecall(id);
            APIService.HideLoading();
          },function(error){
            APIService.HideLoading();
          })
      }
    }

    function RemoveRecall(id) {
      for (var i = 0; i <= $scope.transactions.length - 1; i++) {
        if($scope.transactions[i].id == id){
          $scope.transactions.splice(i, 1);
          break;
        }
      };
    }

    $scope.editRecall = function(id){
      $state.go('app.saveoreditso',{refid:id,id:0});
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

    $scope.convertDateTimeFormat = function(input){
      return GetNewDateByDTEDateFormat(input).datetimeslashformat();
    }

  });
})
