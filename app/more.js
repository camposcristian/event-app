angular.module('aac.more.controller', [])


.controller('MoreController', function ($scope, $window, $location,$state, ApiFactory, UserProfile, Store) {
    $scope.isLog = false;

    $scope.$watch('$viewContentLoaded', function () {
        if (localStorage["token"] != null) {
            $scope.isLog = true;
        }
        else {
            $scope.isLog = false;
        }

    });

    $scope.goToProfile = function () {
        $location.path("/tab/profile/" + localStorage["UserId"]);
    }
    $scope.logout= function () {
        localStorage.removeItem("UserId");
        localStorage.removeItem("token");
        $state.go("tab.home");
    }
});


angular.module('aac.more.service', [])


.factory('MoreService', function (BaseUrl, ApiFactory, $http) {
    return ApiFactory.test();
});