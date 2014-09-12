angular.module('aac.login.controller', [])

.controller('LoginController', function ($scope, $rootScope, $state, AuthService, $ionicLoading) {
    $scope.submit = function (user) {
        $scope.loadingIndicator = $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i><br/>Cargando',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });

        AuthService.login(user).then(function (result) {
            $scope.loadingIndicator.hide();
            $state.transitionTo("tab.more");
        }, function (error) {
            $scope.loadingIndicator.hide();
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

            $http.defaults.transformRequest = function (data) {
                var str = [];
                for (var p in data)
                    if (data.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
                    }
                return str.join("&");
            }

            $http.post(BaseUrl + "/token", user, { headers: header })
            .success(function (data) {
                localStorage["token"] = data.access_token;
                deferred.resolve();
            })
			.error(deferred.reject);
            return deferred.promise;
        }

    }
});



