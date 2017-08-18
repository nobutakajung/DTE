// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'ion-autocomplete','ion-datetime-picker'])

.run(function($ionicPlatform, SQLiteService, FlightDataSQLite, APIService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //open db
    SQLiteService.OpenDB();
    //initial all tables
    SQLiteService.InitailTables();

    InitialFlightDataProcess();

    function InitialFlightDataProcess() {
      //delete recent data
      FlightDataSQLite.DeleteAll().then(function(){
        GetFlightData();
      });
    }

    function GetFlightData(){
      //get new datas(for today)  
      APIService.ShowLoading();
      var url = APIService.hostname() + '/SO/GetFlightData';
      var data = {FlightDate:GetStartStopDateTimeValue(new Date()).substring(0,8)}
      APIService.httpPost(url,data,
        function(response){
          if(response != null && response.data.length > 0){
            FlightDataSQLite.Add(response.data).then(function(){
              APIService.HideLoading();
            });
          }
          else APIService.HideLoading();
        },
        function(error){
          APIService.HideLoading();
          console.log(error);
        })
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.listso', {
    url: '/listso',
    views: {
      'menuContent': {
        templateUrl: 'templates/listso.html',
        controller:'ListSOCtrl'
      }
    }
  })

  .state('app.saveoreditso', {
      url: '/saveoreditso?id',
      views: {
        'menuContent': {
          templateUrl: 'templates/saveoreditso.html',
          controller: 'SaveOrEditSOCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
