angular.module('starter')

.controller('SODetailSOCtrl', function($scope, $ionicModal, APIService, $ionicPopup, $ionicPlatform, $stateParams) {
  $ionicPlatform.ready(function() {
    $scope.userId = window.localStorage.getItem('UserId');
    
    $scope.SOID = $stateParams.id;
    $scope.Transaction;
    
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
      $scope.Transaction = data;

      $scope.WONumber = data.WONumber;
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

    window.broadcaster.addEventListener( "DatecsPrinter.connectionStatus", function(e) {
      console.log(e);
      if (e.isConnected) {
        console.log('printer-connected');
      }
    });

    $scope.printSO = function(){
      APIService.ShowLoading();
      document.addEventListener('deviceready', function () {

        window.DatecsPrinter.listBluetoothDevices(
          function (devices) {
            var deviceIndex = 0;
            for (var i = 0; i <= devices.length - 1; i++) {
              if(devices[i].name == 'MTP-II') {
                deviceIndex = i;
                break;
              }
            };
            //connect printer
            window.DatecsPrinter.connect(devices[deviceIndex].address, 
              function() {
                //print
                printSODetails();
                APIService.HideLoading();
              },
              function() {
                APIService.HideLoading();
                alert('ไม่สามารเชื่อมต่อกับ printer ได้');
              }
            );
          },
          function (error) {
            APIService.HideLoading();
            alert('ไม่พบ printer');
          }
        );

      }, false);
    }

    function printSODetails() {
      var text;
      text = "{b}WONumber: {/b} " + $scope.Transaction.WONumber + "{br}";
      text = text.concat("{b}Station: {/b} " + $scope.Transaction.Station + "{br}");
      text = text.concat("{b}Air Carrier: {/b} " + $scope.Transaction.AircraftCarrier + "{br}");
      text = text.concat("{b}Flightn No: {/b} " + $scope.Transaction.FlightNo + "{br}");
      text = text.concat("{b}Aircraft Type: {/b} " + $scope.Transaction.AircraftType + "{br}");
      text = text.concat("{b}Aircraft Reg: {/b} " + $scope.Transaction.AircraftReg + "{br}");
      text = text.concat("{b}Aircraft STA: {/b} " + GetTimeFormatFromDateFormat($scope.Transaction.ETA) + "{br}");
      text = text.concat("{b}Aircraft STD: {/b} " + GetTimeFormatFromDateFormat($scope.Transaction.ETD) + "{br}");
      text = text.concat("{b}Gate No: {/b} " + $scope.Transaction.GateNo + "{br}");
      text = text.concat("{b}PCA1: {/b} " + (($scope.Transaction.PCA1) ? "True" : "False") + ", ");
      text = text.concat("{b}PCA2: {/b} " + (($scope.Transaction.PCA2) ? "True" : "False") + "{br}");

      text = text.concat("{b}PCAStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.PCAStart)) + "{br}");
      text = text.concat("{b}PCAStop: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.PCAEnd)) + "{br}");
      text = text.concat("{b}PCATotalMin: {/b} " + $scope.Transaction.PCATotalMin + "{br}");

      text = text.concat("{b}GPU1: {/b} " + (($scope.Transaction.GPU1) ? "True" : "False") + ", ");
      text = text.concat("{b}GPU2: {/b} " + (($scope.Transaction.GPU2) ? "True" : "False") + "{br}");

      text = text.concat("{b}GPUStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.GPUStart)) + "{br}");
      text = text.concat("{b}GPUStop: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.GPUEnd)) + "{br}");
      text = text.concat("{b}GPUTotalMin: {/b} " + $scope.Transaction.GPUTotalMin + "{br}");

      text = text.concat("{b}Cond: {/b} " + $scope.Transaction.CondOfCharge + "{br}");
      text = text.concat("{b}Remark: {/b} " + ($scope.Transaction.Remark == null ? '-' : $scope.Transaction.Remark) + "{br}");
      text = text.concat("{b}CreatedBy: {/b} " + $scope.Transaction.CreatedByName + "{br}");
      text = text.concat("{b}UpdatedBy: {/b} " + ($scope.Transaction.UpdatedByName == null ? '-' : $scope.Transaction.UpdatedByName) + "{br}");

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
              $scope.Transaction.CustSignStart.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 280, 150, 0, 
              function() {
                window.DatecsPrinter.printText("{b}Stop-Signature{/b}{br}", 'ISO-8859-1', 
                  function() {
                    //stop signature
                    window.DatecsPrinter.printImage(
                        $scope.Transaction.CustSignStop.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 280, 150, 0, 
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

  });
})
