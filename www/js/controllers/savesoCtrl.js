angular.module('starter')

.controller('SaveSOCtrl', function($scope, $ionicModal) {

  $scope.createTime = GetStartStopDateTimeTxt(new Date());

  $scope.saveso = {station:'', aircarrier:'', flightno:'', aircrafttype:'', aircraftreg:'',
                   aircraftsta:'', aircraftstd:'', gateno:'', system:'PCA', 
                   pca:{hose1:true,hose2:false, startTxt:'', start:'', startDate:'', stopTxt:'', stopDate:'', stop:'',totaltime:''},
                   gpu:{plug1:true,plug2:false, startTxt:'', start:'', startDate:'', stopTxt:'', stopDate:'', stop:'',totaltime:''},
                   idno:window.localStorage.getItem('UserId'),username:window.localStorage.getItem('UserName'), startSignature:'', stopSignature:'', condition:'', remark:''
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
    console.log($scope.saveso);
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
