angular.module('starter')

.controller('SODetailSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $stateParams) {
  $ionicPlatform.ready(function() {
    $scope.userId = window.localStorage.getItem('UserId');
    
    $scope.SOID = $stateParams.id;
    
    InitialSODetail();

    function InitialSODetail() {
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetSOById';
      var data = {Id: $scope.SOID};
      APIService.httpPost(url,data,
        function(response){
          console.log(response.data);
          APIService.HideLoading();
          if(response != null) BindSODetail(response.data);
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
        })
    }

    function BindSODetail(data) {
      if(data == null) return;
      $scope.station = data.Station;
      $scope.aircarrier = data.AircraftCarrier;
      $scope.flightno = data.FlightNo;
      $scope.aircrafttype = data.AircraftType;
      $scope.aircraftreg = data.AircraftReg;
      $scope.aircraftstaTxt = GetNewDateByDTEDateFormat(data.ETA);
      $scope.aircraftstdTxt = GetNewDateByDTEDateFormat(data.ETD);
      $scope.gateno = data.GateNo;
      $scope.startSignature = data.CustSignStart;
      $scope.stopSignature = data.CustSignStop;

      $scope.pca = {};
      if(data.PCAStart && data.PCAStart.length > 0) $scope.pca.startTxt = GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat(data.PCAStart));
      else $scope.pca.startTxt = '';
      if(data.PCAEnd && data.PCAEnd.length > 0) $scope.pca.stopTxt = GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat(data.PCAEnd));
      else $scope.pca.stopTxt = '';
      $scope.pca.totaltime = data.PCATotalMin;
      
      $scope.gpu = {};
      if(data.GPUStart && data.GPUStart.length > 0) $scope.gpu.startTxt = GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat(data.GPUStart));
      else $scope.gpu.startTxt = '';
      if(data.GPUEnd && data.GPUEnd.length > 0) $scope.gpu.stopTxt = GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat(data.GPUEnd));
      else $scope.gpu.stopTxt = '';
      $scope.gpu.totaltime = data.GPUTotalMin;
      
      $scope.pca.hose1 = data.PCA1;
      $scope.pca.hose2 = data.PCA2;
      $scope.gpu.plug1 = data.GPU1;
      $scope.gpu.plug2 = data.GPU2;

      $scope.createby = data.CreateBy;
      $scope.createdbyname = data.CreatedByName;

      $scope.condition = data.CondOfCharge;
      $scope.remark = data.Remark;
      //bind upload images
      $scope.uploadImgs = data.UploadImages;

    }

  });
})
