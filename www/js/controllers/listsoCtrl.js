angular.module('starter')

.controller('ListSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    $scope.allDatas = [];
    $scope.transactions = [];
    $scope.userId = GetUserId();
    $scope.station = GetUserStation();
    $scope.search = {SearchDate : ''};

    //initial list so get top 100 so
    GetListSO('');

    function GetListSO(selectedDate){
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetSO';
      var data = {Station:$scope.station, SelectedDate: selectedDate};
      APIService.httpPost(url,data,
        function(response){
          APIService.HideLoading();
          if(response != null){
            if(selectedDate = '') $scope.allDatas = response.data;
            $scope.transactions = response.data;
          }
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
        })
    }

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

    $scope.SODetail = function(id){
      // $state.go('app.saveoreditso',{id:id});
      $state.go('app.sodetail',{id:id});
    };

    $scope.TimeChange = function(){
      var query = $scope.search.SearchDate.dateslashformat();
      console.log(query);
      GetListSO(query);
      // //filter by createdate
      // $scope.transactions =  [];
      // for (var i = 0; i <= $scope.allDatas.length - 1; i++) {
      //   if($scope.allDatas[i].CreatedDateTxt.indexOf(query) >= 0) $scope.transactions.push($scope.allDatas[i]);
      // };
    };

    $scope.clearFilter = function(){
      $scope.search.SearchDate = '';
      GetListSO('');
    };

  });
})
