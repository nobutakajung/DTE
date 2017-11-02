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
      $scope.aircraftstaTxt = GetNewDateByDTEDateFormat(data.ETA).datetimeslashformat();
      $scope.aircraftstdTxt = GetNewDateByDTEDateFormat(data.ETD).datetimeslashformat();
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

    try{
      window.broadcaster.addEventListener( "DatecsPrinter.connectionStatus", function(e) {
        console.log(e);
        if (e.isConnected) {
          console.log('printer-connected');
        }
      });
    } catch(err) {}
    
    $scope.printSO = function(){
      APIService.ShowLoading();
      
      PrintWithDetectPrinterPlugIn();

      APIService.HideLoading();
    }

    function PrintWithOfficialPlugIn () {
      cordova.plugins.printer.check(function (available, count) {
          alert(available ? 'Found ' + count + ' services' : 'No');
      });

      cordova.plugins.printer.print('<html><h1>ABC-DEFG</h1></html>', { duplex: 'long' }, function (res) {
          alert(res ? 'Done' : 'Canceled');
      });
    }

    function PrintWithBlueToothPlugIn () {
      //list printer
      BTPrinter.list(function(printers){
          console.log("Success");
          //connect to printer
          BTPrinter.connect(function(connectResponse){        
            console.log(connectResponse);
          },function(err){
            console.log("Error");
            console.log(err)
          }, printers[0]);

          // //print some text
          // BTPrinter.printText(function(printTxtResponse){
          //     console.log(printTxtResponse)
          // },function(err){
          //     console.log("Error");
          //     console.log(err)
          // }, "\n Al Kifah \n Ameera \n My Lovely \n \n \n \n");

          //print some image
          BTPrinter.printImage(function(data){
              console.log("Success");
              console.log(data)
          },function(err){
              console.log("Error");
              console.log(err)
          }, "data:image/jpeg;base64,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");

          //disconnect printer
          BTPrinter.disconnect(function(data){
            console.log("Disconnect - Success");
            console.log(data)
          },function(err){
            console.log("Error");
            console.log(err)
          },printers[0]);

          
      },function(err){
          console.log("Error");
          console.log(err);
      })
    }

    function PrintWithDetectPrinterPlugIn () {
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
                TestPrintImg();
                // //print
                // printSODetails();
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
      text = text.concat("{b}PCA1: {/b} " + (($scope.Transaction.PCA1) ? "/" : "X") + ", ");
      text = text.concat("{b}PCA2: {/b} " + (($scope.Transaction.PCA2) ? "/" : "X") + "{br}");

      // text = text.concat("{b}PCAStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.PCAStart)) + "{br}");
      if($scope.Transaction.PCAStart && $scope.Transaction.PCAStart.length > 0)
        text = text.concat("{b}PCAStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.PCAStart)) + "{br}");
      else
        text = text.concat("{b}PCAStart: {/b} " + "-" + "{br}");
      if($scope.Transaction.PCAEnd && $scope.Transaction.PCAEnd.length > 0) 
        text = text.concat("{b}PCAStop: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.PCAEnd)) + "{br}");
      else 
        text = text.concat("{b}PCAStop: {/b} " + "-" + "{br}"); 
      // text = text.concat("{b}PCAStop: {/b} " + (($scope.Transaction.PCAEnd && $scope.Transaction.PCAEnd.length > 0) ? GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.PCAEnd)) : '-' + "{br}");

      text = text.concat("{b}PCATotalMin: {/b} " + $scope.Transaction.PCATotalMin + "{br}");

      text = text.concat("{b}GPU1: {/b} " + (($scope.Transaction.GPU1) ? "/" : "X") + ", ");
      text = text.concat("{b}GPU2: {/b} " + (($scope.Transaction.GPU2) ? "/" : "X") + "{br}");

      // text = text.concat("{b}GPUStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.GPUStart)) + "{br}");
      if($scope.Transaction.GPUStart && $scope.Transaction.GPUStart.length > 0)
        text = text.concat("{b}GPUStart: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.GPUStart)) + "{br}");
      else
        text = text.concat("{b}GPUStart: {/b} " + "-" + "{br}");
      if($scope.Transaction.GPUEnd && $scope.Transaction.GPUEnd.length > 0)
        text = text.concat("{b}GPUStop: {/b} " + GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.GPUEnd)) + '{br}');
      else
        text = text.concat("{b}GPUStop: {/b} " + '-' + '{br}');

      // text = text.concat("{b}GPUStop: {/b} " + ($scope.Transaction.GPUEnd && $scope.Transaction.GPUEnd.length > 0) ? GetStartStopDateTimeTxt(GetNewDateByDTEDateFormat($scope.Transaction.GPUEnd)) : '-' + "{br}";
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
          if($scope.Transaction.CustSignStart == null || !$scope.Transaction.CustSignStart || $scope.Transaction.CustSignStart.length <= 0) return;
          //start signature
          window.DatecsPrinter.printImage(
              $scope.Transaction.CustSignStart.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 280, 150, 0, 
              function() {
                window.DatecsPrinter.printText("{b}Stop-Signature{/b}{br}", 'ISO-8859-1', 
                  function() {
                    if($scope.Transaction.CustSignStop == null || !$scope.Transaction.CustSignStop || $scope.Transaction.CustSignStop.length <= 0) return;
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

    function TestPrintImg() {
      var image = new Image();
      image.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAaACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD48/ZF/wCCMXxk1b4c/wBueFW/Z98RaT4hjiube58RPcXk0ClMlABAwUbuCOc9ewr9J/2ZP+De/wAIv8ONBvPiA3hXQvGkkXmX7eENJis7VpMkoIy6h9qjHzHG45PyjAH4p/8ABJbxx4w0v9tz4Q6D4d8RahpcGteLNPt57U38sVjcRNOvmLJEsio4KBuCrEkgd6/qB+KP7Y3gb9nLVPBujeINf02HxJ8RLwaB4X0mWFri81i+LpEojRQflEksSlmCoMjLDPHDWwcKr5Z7P5fimjbC4pp3h007/meFWv8AwTE8A6N4L1Sa3eHW4tBkltv+Jn4ZNrdPLEfmAdtokQ8FZFQq6kEOw5r8sP8Agud8Kvh/8F/hR4LfTdC0q18RT6u0U626ospiETs7nH8I3RcHAyw6HAP7Y/E39pvxN8K/iP8ADfwH4q+HPjbVbP4g3VzYW2r6LZR3ek6KIoQzf2jLuAhXBJXOSwLEBjGQP51f+C7fi1de/bz1vwzay29xofgu3itrFku2uJD58aXDl2JOGAeOPHPyxKc5JxUsNHlVPovNt/e9TSrinRcqiaeujsrP5HzOltpGueGrqa0S3lCxkHC4ZDjuOo/GivPXurjRfMkt5GhaRNpIX76+n0ornjg5wb5Hobf2nCtFOUbM9S/Yu8G2/wARP2lPh7pF1qUej2Uus29xeXrvt+y28DfaJnByPmEcTleR820ZFfpt4r/4OGLj9lf9pDUNNtPDun/FLS/D00l1pOqyXKNfaTLLvLxR3DxsR8jmPcmCVcg8fJX4xxXUkdn8ski8Y4Y1YsJ3U7QzBfQHjpXqeZ5UFyRfL1Z+43jT/g650vxvdWVvN8OfFtxp8jxi+UXsMKrGTmV1Xd++ZcfKjGMPj78Zr5R/4Lf6n8JPjxqXgj44fCnxRpOqQ+Mrc6NrlhFKI7mC4to1MEr27fvIH8k+U6MAF8mEruEm4/nTcXUg2/vJPu5+8ahklbdnc2eRnPalLUiUnKLjI0dakV4G+7nBHHaisSWVih+ZunrRTKpU7RP/2Q==';
      image.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.height = 50;
          canvas.width = 50;
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ""); //remove mimetype
          window.DatecsPrinter.printImage(
              imageData, //base64
              canvas.width, 
              canvas.height, 
              1, 
              function() {
                console.log('image-success');      
              },
              function(error) {
                  alert(JSON.stringify(error));
              }
          )
      };

    }


  });
})
