angular.module('starter')

    .service('AuthService', function($q,APIService) {
        var username = '';
        
        function loadUserCredentials() {
            var token = window.localStorage.getItem(AUTH_EVENTS.LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function destroyUserCredentials() {
           
        }

        var login = function(user, pw) {
            return $q(function(resolve,reject){
                APIService.ShowLoading();
                var url = APIService.hostname() + '/SO/Login';
                var data = {UserID:user,Password:pw};
                APIService.httpPost(url,data,function(response){
                    APIService.HideLoading();
                    if(response != null && response.data != null){
                        //keep userdata into local storage
                        window.localStorage.setItem('AuthServices_isAuthenticated',true);
                        window.localStorage.setItem('UserName',user);
                        window.localStorage.setItem('UserId',response.data.id);
                        window.localStorage.setItem('Station',response.data.Station);
                        return resolve(true);    
                    }
                    else return resolve(false);
                },function(error){ APIService.HideLoading(); return resolve(false); console.log(error);})
                
            })
        };

        var logout = function() {
            window.localStorage.removeItem('AuthServices_isAuthenticated');
            window.localStorage.removeItem('UserName');
            window.localStorage.removeItem('UserId');
            window.localStorage.removeItem('Station');
        };

        return {
            login: login,
            logout: logout,
            isAuthenticated: function() {return window.localStorage.getItem("AuthServices_isAuthenticated");}, 
            username: function() {return (!username && username != null && username.length > 0) ? username : window.localStorage.getItem(AUTH_EVENTS.LOCAL_USERNAME_KEY);},
            logout: logout
        };
    })

    function ClearAllUserLocalStorage(AUTH_EVENTS){
        //window.localStorage.removeItem(AUTH_EVENTS.LOCAL_TOKEN_KEY);
    };

    function SetDefaultDeviceSettings ($q) {
       
    };