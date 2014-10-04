angular.module('aac.login.controller', [])

.controller('LoginController', function ($scope, $rootScope, $state, $ionicPopup, AuthService, $ionicLoading) {
    $scope.submit = function (user) {
        $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i><br/>Cargando',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        AuthService.login(user).then(function (result) {
            $ionicLoading.hide();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $state.transitionTo("tab.more");
        }, function (error) {
            $scope.loadingIndicator.hide();
            var alertPopup = $ionicPopup.alert({
                title: 'ERROR DE LOGIN',
                template: 'Usuario y/o contraseña invalidos'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        });
    }
});

angular.module('aac.login.service', [])

.factory('authHttpResponseInterceptor', ['$q', '$location', '$rootScope', '$injector', function ($q, $location, $rootScope, $injector) {
    return {
        response: function (response) {
            if (response.status === 401) {
                console.log("Response 401");
            }
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401", rejection);
                $rootScope.loadingIndicator.hide();
                $injector.get("$ionicLoading").show({
                    content: rejection.data.errores[0],
                    animation: 'fade-in',
                    showBackdrop: false,
                    duration: 2000
                });
            }
            return $q.reject(rejection);
        }
    }
}])


.factory('AuthService', function (BaseUrl, $http, $q) {
    var isLoggedIn = localStorage["token"];

    return {

        login: function (user) {
            var deferred = $q.defer();
            user.grant_type = "password";
            var header = { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
            var encodedData = "username=" + user.username + "&password=" + user.password + "&grant_type=" + user.grant_type;
            $http({
                url: BaseUrl+'/token',
                method: 'POST',
                headers: header,
                data: encodedData,
            })
                .success(function (data) {
                    localStorage["token"] = data.access_token;
                    localStorage["UserId"] = data.userId;
                deferred.resolve();
            })
               .error(deferred.reject);
            return deferred.promise;
        }

    }
});



