angular.module('starter')

.controller('SaveOrEditSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $cordovaCamera, FlightDataSQLite, $ionicHistory, $state, $stateParams, $cordovaPrinter) {

  $ionicPlatform.ready(function() {

    //$scope.createTime = GetStartStopDateTimeTxt(new Date());

    $scope.SOID = $stateParams.id;
    $scope.EditTransaction;
    $scope.title = $scope.SOID == 0 ? 'บันทึก' : 'แก้ไข';

    //AutoComplete//
    function GetFlightDatas(){
      APIService.ShowLoading();
      FlightDataSQLite.GetFlightDatas().then(
        function(response){
          if(response != null){
            var dbResult = ConvertQueryResultToArray(response);
            $scope.autoCompleteDatas = dbResult;
          }
          APIService.HideLoading();
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
        })
    }
   
    $scope.getFlights = function (query) {
      if(query){
        return {items:filterFlightDatas($scope.autoCompleteDatas,query)};
      }
      return {items:[]};
    };

    $scope.itemsClicked = function(item){
      console.log(item);
      var data = item.item;
      //bind datas to inputs
      $scope.saveso.aircarrier = data.ACCarrier;
      $scope.saveso.aircraftreg = data.ACReg;
      $scope.saveso.aircrafttype = data.ACType;
      $scope.saveso.gateno = data.GateNo;
      $scope.saveso.aircraftsta = data.STAValueTxt;
      $scope.saveso.aircraftstaTxt = GetNewDateByDTEDateFormat(data.STAValueTxt);
      $scope.saveso.aircraftstd = data.STDValueTxt;
      $scope.saveso.aircraftstdTxt = GetNewDateByDTEDateFormat(data.STDValueTxt);
    };

    $scope.itemsRemoved = function(item){
      $scope.saveso.aircarrier = ''
      $scope.saveso.aircraftreg = ''
      $scope.saveso.aircrafttype = ''
      $scope.saveso.gateno = ''
      $scope.saveso.aircraftsta = ''
      $scope.saveso.aircraftstd = ''
    }
    //AutoComplete//

    InitialProcess();

    function InitialProcess(){
      //for auto complete
      GetFlightDatas();
      //EDIT bind data to all inputs
      if($scope.SOID != 0) GetAndBindSODataById($scope.SOID);
    }

    function GetAndBindSODataById(id) {
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetSOById';
      var data = {Id:id};
      APIService.httpPost(url,data,
        function(response){
          if(response != null) BindSOData(response.data);
          else IonicAlert($ionicPopup,'ไม่พบข้อมูล SO',null);
          APIService.HideLoading();
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
          IonicAlert($ionicPopup,'ไม่พบข้อมูล SO',null);
        });
    }

    function BindSOData(data) {
      $scope.EditTransaction = data;
      console.log(data);
      $scope.serviceRate = data.ServiceRate;
      $scope.saveso.station = data.Station;
      $scope.saveso.aircarrier = data.AircraftCarrier;
      $scope.saveso.flightno = data.FlightNo;
      $scope.saveso.aircrafttype = data.AircraftType;
      $scope.saveso.aircraftreg = data.AircraftReg;
      $scope.saveso.aircraftsta = data.ETA;
      $scope.saveso.aircraftstaTxt = GetNewDateByDTEDateFormat(data.ETA);
      $scope.saveso.aircraftstd = data.ETD;
      $scope.saveso.aircraftstdTxt = GetNewDateByDTEDateFormat(data.ETD);
      $scope.saveso.gateno = data.GateNo;
      $scope.saveso.startSignature = data.CustSignStart;
      $scope.saveso.stopSignature = data.CustSignStop;

      $scope.saveso.pca.startDate = GetNewDateByDTEDateFormat(data.PCAStart);
      $scope.saveso.pca.startTxt = GetStartStopDateTimeTxt($scope.saveso.pca.startDate);
      $scope.saveso.pca.start = data.PCAStart;
      $scope.saveso.pca.totaltime = data.PCATotalMin;
      $scope.saveso.pca.stopDate = GetNewDateByDTEDateFormat(data.PCAEnd);
      $scope.saveso.pca.stopTxt = GetStartStopDateTimeTxt($scope.saveso.pca.stopDate);
      $scope.saveso.pca.stop = data.PCAEnd;

      $scope.saveso.gpu.startDate = GetNewDateByDTEDateFormat(data.GPUStart);
      $scope.saveso.gpu.startTxt = GetStartStopDateTimeTxt($scope.saveso.gpu.startDate);
      $scope.saveso.gpu.start = data.GPUStart;
      $scope.saveso.gpu.totaltime = data.GPUTotalMin;
      $scope.saveso.gpu.stopDate = GetNewDateByDTEDateFormat(data.GPUEnd);
      $scope.saveso.gpu.stopTxt = GetStartStopDateTimeTxt($scope.saveso.gpu.stopDate);
      $scope.saveso.gpu.stop = data.GPUStop;

      $scope.saveso.pca.hose1 = data.PCA1;
      $scope.saveso.pca.hose2 = data.PCA2;
      $scope.saveso.gpu.plug1 = data.GPU1;
      $scope.saveso.gpu.plug2 = data.GPU2;
      $scope.saveso.condition = data.CondOfCharge;
      $scope.saveso.remark = data.Remark;
      //bind upload images
      $scope.uploadImgs = data.UploadImages;
    }

    $scope.uploadImgs = [];

    $scope.createTime = GetStartStopDateTimeTxt(new Date());

    $scope.saveso = {station:window.localStorage.getItem('Station'), aircarrier:'', flightno:'', aircrafttype:'', aircraftreg:'',
                     aircraftsta:'', aircraftstaTxt:'', aircraftstd:'', aircraftstdTxt:'', gateno:'', system:'PCA', 
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
        signature = new SignaturePad(canvas, {backgroundColor:'rgb(255,255,255)'});
      }
    }

    $scope.clearCanvas = function(){
      signature.clear();
    }

    $scope.closeSignature = function(){
      $scope.modalSignature.hide();
    }

    $scope.doSaveOrEditSO = function(){
      if(!CheckValidate()) return;
      APIService.ShowLoading();
      var url;
      if($scope.SOID == 0) url = APIService.hostname() + '/SO/SaveSO';
      else url = APIService.hostname() + '/SO/EditSO';
      var data = {
                  Station:$scope.saveso.station, FlightNo:$scope.saveso.flightno, ACType:$scope.saveso.aircrafttype, ACCarrier:$scope.saveso.aircarrier,
                  ACReg:$scope.saveso.aircraftreg, STA:$scope.saveso.aircraftsta, STD:$scope.saveso.aircraftstd, GateNo:$scope.saveso.gateno,
                  PCA1:$scope.saveso.pca.hose1, PCA2:$scope.saveso.pca.hose2, PCAStart:$scope.saveso.pca.start, PCAStop:$scope.saveso.pca.stop,
                  PCATotalTime:$scope.saveso.pca.totaltime, GPU1:$scope.saveso.gpu.plug1, GPU2:$scope.saveso.gpu.plug2,
                  GPUStart:$scope.saveso.gpu.start, GPUStop:$scope.saveso.gpu.stop, GPUTotalTime:$scope.saveso.gpu.totaltime,
                  UserID:$scope.saveso.idno, CustIDStart:$scope.saveso.username, CustSignStart:$scope.saveso.startSignature,
                  CustIDStop:$scope.saveso.username, CustSignStop:$scope.saveso.stopSignature, CondOfCharge:$scope.saveso.condition,
                  Remark:$scope.saveso.remark, UploadImages:$scope.uploadImgs, Id:$scope.SOID
                 };
      APIService.httpPost(url,data,function(response){
        APIService.HideLoading();
        if(response != null && response.data.success == 1){
          //success
          var message;
          if($scope.SOID == 0) message = "สร้างรายการเรียบร้อย : " + response.data.message;
          else message = "แก้ไขเรียบร้อย";
          IonicAlert($ionicPopup, message, function(){
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.home');
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
      if($scope.currentSignature == 'start') $scope.saveso.startSignature = signature.toDataURL("image/jpeg",150);
      else $scope.saveso.stopSignature = signature.toDataURL("image/jpeg",150);
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
          if($scope.SOID != 0){
            if(isStart) signature.fromDataURL($scope.saveso.startSignature);
            else signature.fromDataURL($scope.saveso.stopSignature);      
          }
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

    $scope.UploadImage = function(){
      var options = { 
                     destinationType: Camera.DestinationType.DATA_URL,
                     sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                     encodingType: Camera.EncodingType.JPEG,
                     targetWidth: 100,
                     targetHeight: 100,
                    };
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.uploadImgs.push("data:image/jpeg;base64," + imageData);
      }, function(err) {
          console.log(err);
      });
    }

    $scope.TimeChange = function(isSTA){
      var selectedDate;
      var recentValue;
      if(isSTA){
        selectedDate = $scope.saveso.aircraftstaTxt;
        recentValue = $scope.saveso.aircraftsta;
      } 
      else{
        selectedDate = $scope.saveso.aircraftstdTxt;
        recentValue = $scope.saveso.aircraftstd;
      } 

      var hour = selectedDate.getHours().toString();
      hour = hour.length > 1 ? hour : '0' + hour;

      var minute = selectedDate.getMinutes().toString();
      minute = minute.length > 1 ? minute : '0' + minute;

      //substring 20170815
      recentValue = recentValue.substring(0,8);
      var newValue = recentValue + hour + minute + '00'

      console.log(newValue);
      if(isSTA) $scope.saveso.aircraftsta = newValue;
      else $scope.saveso.aircraftstd = newValue;
    }

    $scope.$on('$destroy',function(){
      if($scope.modalSignature != null) $scope.modalSignature.remove();
    })

    $scope.printSO = function(){
      document.addEventListener('deviceready', function () {

        window.DatecsPrinter.listBluetoothDevices(
          function (devices) {
            //connect printer
            window.DatecsPrinter.connect(devices[0].address, 
              function() {
                //print
                printSODetails();
              },
              function() {
                alert(JSON.stringify(error));
              }
            );
          },
          function (error) {
            alert(JSON.stringify(error));
          }
        );

      }, false);
    }

    function printSODetails() {
      var text;
      text = "{b}WONumber: {/b} " + $scope.EditTransaction.WONumber + "{br}";
      text = text.concat("{b}Station: {/b} " + $scope.EditTransaction.Station + "{br}");
      text = text.concat("{b}Air Carrier: {/b} " + $scope.EditTransaction.AircraftCarrier + "{br}");
      text = text.concat("{b}Flightn No: {/b} " + $scope.EditTransaction.FlightNo + "{br}");
      text = text.concat("{b}Aircraft Type: {/b} " + $scope.EditTransaction.AircraftType + "{br}");
      text = text.concat("{b}Aircraft Reg: {/b} " + $scope.EditTransaction.AircraftReg + "{br}");
      text = text.concat("{b}Aircraft STA: {/b} " + GetTimeFormatFromDateFormat($scope.EditTransaction.ETA) + "{br}");
      text = text.concat("{b}Aircraft STD: {/b} " + GetTimeFormatFromDateFormat($scope.EditTransaction.ETD) + "{br}");
      text = text.concat("{b}Gate No: {/b} " + $scope.EditTransaction.GateNo + "{br}");
      text = text.concat("{b}PCA1: {/b} " + (($scope.EditTransaction.PCA1) ? "True" : "False") + ", ");
      text = text.concat("{b}PCA2: {/b} " + (($scope.EditTransaction.PCA2) ? "True" : "False") + "{br}");

      text = text.concat("{b}PCAStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.EditTransaction.PCAStart)) + "{br}");
      text = text.concat("{b}PCAStop: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.EditTransaction.PCAEnd)) + "{br}");
      text = text.concat("{b}PCATotalMin: {/b} " + $scope.EditTransaction.PCATotalMin + "{br}");

      text = text.concat("{b}GPU1: {/b} " + (($scope.EditTransaction.GPU1) ? "True" : "False") + ", ");
      text = text.concat("{b}GPU2: {/b} " + (($scope.EditTransaction.GPU2) ? "True" : "False") + "{br}");

      text = text.concat("{b}GPUStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.EditTransaction.GPUStart)) + "{br}");
      text = text.concat("{b}GPUStop: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.EditTransaction.GPUEnd)) + "{br}");
      text = text.concat("{b}GPUTotalMin: {/b} " + $scope.EditTransaction.GPUTotalMin + "{br}");

      text = text.concat("{b}Cond: {/b} " + $scope.EditTransaction.CondOfCharge + "{br}");
      text = text.concat("{b}Remark: {/b} " + ($scope.EditTransaction.Remark == null ? '-' : $scope.EditTransaction.Remark) + "{br}");
      text = text.concat("{b}CreatedBy: {/b} " + $scope.EditTransaction.CreatedByName + "{br}");
      text = text.concat("{b}UpdatedBy: {/b} " + ($scope.EditTransaction.UpdatedByName == null ? '-' : $scope.EditTransaction.UpdatedByName) + "{br}");

      window.DatecsPrinter.printText(text, 'ISO-8859-1', 
        function() {
          //printMyImage();
          PrintSOSignatures();
        }
      );
    }

    function PrintSOSignatures() {
      window.DatecsPrinter.printText("{b}Start-Signature{/b}{br}", 'ISO-8859-1', 
        function() {
          //start signature
          window.DatecsPrinter.printImage(
              $scope.EditTransaction.CustSignStart.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 280, 150, 0, 
              function() {
                window.DatecsPrinter.printText("{b}Stop-Signature{/b}{br}", 'ISO-8859-1', 
                  function() {
                    //stop signature
                    window.DatecsPrinter.printImage(
                        $scope.EditTransaction.CustSignStop.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 280, 150, 0, 
                        function() {},
                        function(error) {
                            alert(JSON.stringify(error));
                        }
                    )
                  }
                );
              },
              function(error) {
                  alert(JSON.stringify(error));
              }
          )
        }
      );
    }

    function CheckValidate(){
      var flag = true;
      //air carrier
      if($scope.saveso.aircarrier == null || !$scope.saveso.aircarrier || $scope.saveso.aircarrier.length == 0) flag = false;
      //flight no
      if($scope.saveso.flightno == null || !$scope.saveso.flightno || $scope.saveso.flightno.length == 0) flag = false;
      //aircraft type
      if($scope.saveso.aircrafttype == null || !$scope.saveso.aircrafttype || $scope.saveso.aircrafttype.length == 0) flag = false;
      //aircraft reg
      if($scope.saveso.aircraftreg == null || !$scope.saveso.aircraftreg || $scope.saveso.aircraftreg.length == 0) flag = false;
      //aircraft sta
      if($scope.saveso.aircraftsta == null || !$scope.saveso.aircraftsta || $scope.saveso.aircraftsta.length == 0) flag = false;
      //aircraft std
      if($scope.saveso.aircraftstd == null || !$scope.saveso.aircraftstd || $scope.saveso.aircraftstd.length == 0) flag = false;

      if(flag) return true;
      else {
        alert('Air-Carrier/ Flight-No/ Aircraft-Type/ Aircraft-Reg/ Aircraft STA/ Aircraft STD ห้ามเป็นค่าว่าง');
        return false;
      }
    }

  });

})
