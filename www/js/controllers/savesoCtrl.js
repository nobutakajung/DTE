angular.module('starter')

.controller('SaveSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup) {

  //AutoComplete//
  $scope.autoCompleteDatas = [{FLNO:'TG123'},{FLNO:'TG124'},{FLNO:'TG125'}];
  //read employee master data from file
  // ReadEmployeeMasterData($q,APIService,$cordovaFile).then(function(response){
  //   if(response != null) $scope.autoCompleteDatas = response;
  // });

  $scope.getFlights = function (query) {
    if(query){
      return {items:$scope.autoCompleteDatas};
    }
    return {items:[]};
  };
  //AutoComplete//

  $scope.uploadImgs = ['img/1.jpg','img/2.jpg','img/3.jpg'];

  $scope.createTime = GetStartStopDateTimeTxt(new Date());

  $scope.saveso = {station:'', aircarrier:'', flightno:'', aircrafttype:'', aircraftreg:'',
                   aircraftsta:'', aircraftstd:'', gateno:'', system:'PCA', 
                   pca:{hose1:true,hose2:false, startTxt:'', start:'', startDate:'', stopTxt:'', stopDate:'', stop:'',totaltime:''},
                   gpu:{plug1:true,plug2:false, startTxt:'', start:'', startDate:'', stopTxt:'', stopDate:'', stop:'',totaltime:''},
                   idno:window.localStorage.getItem('UserId'),username:window.localStorage.getItem('UserName'), startSignature:'', 
                   stopSignature:'', condition:'', remark:''
                  };

  $scope.currentSignature;
  $scope.modalSignature;

  var signature;

  function InitialSignature(){
    if(signature == null){
      var canvas = document.getElementById('signatureCanvas');
      signature = new SignaturePad(canvas);  
    }
  }

  $scope.clearCanvas = function(){
    signature.clear();
  }

  $scope.closeSignature = function(){
    $scope.modalSignature.hide();
  }

  $scope.doSaveSO = function(){
    APIService.ShowLoading();
    var url = APIService.hostname() + '/SO/SaveSO';
    var data = {
                Station:$scope.saveso.station, FlightNo:$scope.saveso.flightno, ACType:$scope.saveso.aircrafttype, ACCarrier:$scope.saveso.aircarrier,
                ACReg:$scope.saveso.aircraftreg, STA:$scope.saveso.aircraftsta, STD:$scope.saveso.aircraftstd, GateNo:$scope.saveso.gateno,
                PCA1:$scope.saveso.pca.hose1, PCA2:$scope.saveso.pca.hose2, PCAStart:$scope.saveso.pca.start, PCAStop:$scope.saveso.pca.stop,
                PCATotalTime:$scope.saveso.pca.totaltime, GPU1:$scope.saveso.gpu.plug1, GPU2:$scope.saveso.gpu.plug2,
                GPUStart:$scope.saveso.gpu.start, GPUStop:$scope.saveso.gpu.stop, GPUTotalTime:$scope.saveso.gpu.totaltime,
                UserID:$scope.saveso.idno, CustIDStart:$scope.saveso.username, CustSignStart:$scope.saveso.startSignature,
                CustIDStop:$scope.saveso.username, CustSignStop:$scope.saveso.stopSignature, CondOfCharge:$scope.saveso.condition,
                Remark:$scope.saveso.remark, UploadImages:$scope.uploadImgs
               };
    APIService.httpPost(url,data,function(response){
      APIService.HideLoading();
      if(response != null && response.data.success == 1){
        //success
        IonicAlert($ionicPopup,"สร้างรายการเรียบร้อย : " + response.data.message,function(){
          window.location = '#/app/home';
        });
      }
      else{
        //not success
        IonicAlert($ionicPopup,response.data.message,null);
      }
    },function(error){
      APIService.HideLoading();
    })
  }

  $scope.removeUploadImg = function(index){
    $scope.uploadImgs.splice(index,1);
  }

  $scope.OpenModalSignature = function(isStart){
    $scope.currentSignature = (isStart == true) ? 'start':'stop';
    showModalSignature(isStart);
  }

  $scope.saveSignature = function(){
    if(signature.isEmpty()) return;
    if($scope.currentSignature == 'start') $scope.saveso.startSignature = signature.toDataURL();
    else $scope.saveso.stopSignature = signature.toDataURL();
    $scope.closeSignature();
  }

  function showModalSignature(isStart) {
    if($scope.modalSignature == null){
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/signaturepopup.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modalSignature = modal;
        $scope.modalSignature.show();
        InitialSignature();
      });  
    }
    else {
      //signature
      $scope.clearCanvas();
      if(isStart) signature.fromDataURL($scope.saveso.startSignature);
      else signature.fromDataURL($scope.saveso.stopSignature);      
      $scope.modalSignature.show();
    }
  };

  $scope.stampStartDateTime = function(isPCA){
    var currentdate = new Date();
    if(isPCA){
      $scope.saveso.pca.startDate = currentdate;
      $scope.saveso.pca.startTxt = GetStartStopDateTimeTxt(currentdate);
      $scope.saveso.pca.start = GetStartStopDateTimeValue(currentdate);
      //clear stop & totaltime
      $scope.saveso.pca.stopTxt = '';
      $scope.saveso.pca.stop = '';
      $scope.saveso.pca.stopDate = '';
      $scope.saveso.pca.totaltime = '';
    } 
    else{
      $scope.saveso.gpu.startDate = currentdate
      $scope.saveso.gpu.startTxt = GetStartStopDateTimeTxt(currentdate);
      $scope.saveso.gpu.start = GetStartStopDateTimeValue(currentdate);
      //clear stop & totaltime
      $scope.saveso.gpu.stopTxt = '';
      $scope.saveso.gpu.stop = '';
      $scope.saveso.gpu.stopDate = '';
      $scope.saveso.gpu.totaltime = '';
    }
  }

  $scope.stampStopDateTime = function(isPCA){
    var currentdate = new Date();
    if(isPCA){
      $scope.saveso.pca.stopDate = currentdate;
      $scope.saveso.pca.stopTxt = GetStartStopDateTimeTxt(currentdate);
      $scope.saveso.pca.stop = GetStartStopDateTimeValue(currentdate);
      //calculate totaltime
      if($scope.saveso.pca.startDate != null && $scope.saveso.pca.stopDate != null)
        $scope.saveso.pca.totaltime = DiffStartStopDate($scope.saveso.pca.startDate,$scope.saveso.pca.stopDate);
    }
    else{
      $scope.saveso.gpu.stopDate = currentdate;
      $scope.saveso.gpu.stopTxt = GetStartStopDateTimeTxt(currentdate);
      $scope.saveso.gpu.stop = GetStartStopDateTimeValue(currentdate);
      //calculate totaltime
      if($scope.saveso.gpu.startDate != null && $scope.saveso.gpu.stopDate != null)
        $scope.saveso.gpu.totaltime = DiffStartStopDate($scope.saveso.gpu.startDate,$scope.saveso.gpu.stopDate);
    }
  }

})
