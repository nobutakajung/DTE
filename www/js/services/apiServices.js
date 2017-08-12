angular.module('starter').service('APIService',function($http,$httpParamSerializerJQLike,$ionicLoading,$q,$ionicPopup,$timeout){

    var service = this;

	this.httpPost = function(url,data,success,error){
        var deferred = $q.defer();
        var isTimeOut = false;
		var searchConfig = {timeout:deferred.promise};
        var gcmToken = (window.localStorage.getItem('GCMToken') == null ? '' : window.localStorage.getItem('GCMToken'));
        searchConfig.headers = {'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8','RegisterID': gcmToken};
		$http.post(url,$httpParamSerializerJQLike(data),searchConfig).then(
        function(response){
        	success(response);
        },
        function(response){
            if(isTimeOut){
                response = {status:599,data:'ไม่ได้รับข้อมูลจาก server นานเกินไป / โปรดลองอีกครั้ง'};
                service.HideLoading();
            } 
            ShowErrorByStatus(response,$ionicPopup);
        	error(response);
        });

        $timeout(function() {
            isTimeOut = true;
            deferred.resolve(); // this aborts the request!
        }, 60000);
    
	};

    this.httpGet = function(url,param,success,error){
        $http({
          method: 'GET',
          url: url,
          params: param //{json format}
        }).then(
        function(response){
            success(response);
        },
        function(response){
            error(response);
        });
    };

    this.httpPut = function(url,data,success,error){
        var searchConfig = {};
        searchConfig.headers = {'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'};
        $http.put(url,data,searchConfig).then(
        function(response){
            success(response);
        },
        function(response){
            error(response);
        });
    };

	this.hostname = function(){
	    //return 'https://10.74.17.239:8443/AOTWebAPI2';
	    //return 'https://10.74.17.188:8443/AOTWebAPI';
        //return 'http://localhost:51754/api';
         // return 'https://eservice.airportthai.co.th/AOTWebAPI';
        return 'https://mobile.airportthai.co.th/API';
	};

	this.ShowLoading = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            template:'<img src="img/loading.gif" />'
        });
    };

    this.HideLoading = function(){
        $ionicLoading.hide();
    };

});