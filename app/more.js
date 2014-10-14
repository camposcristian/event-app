angular.module('aac.more.controller', [])


.controller('MoreController', function ($scope, $window, $location,$state, ApiFactory,WebApiFactory, UserProfile, Store) {
    $scope.isLog = false;
    $scope.updates = false;

    $scope.gotoTW = function () {
        window.open("https://twitter.com/hashtag/AAC85?src=hash", '_system');
    }

    $scope.$watch('$viewContentLoaded', function () {
        if (localStorage["token"] != null) {
            $scope.isLog = true;
        }
        else {
            $scope.isLog = false;
        }
        WebApiFactory.all('tables/NotificationFeedback?__systemproperties=__updatedAt').success(function (data) {
            var lastDate = Store.get('lastSync');
            $scope.updates = (data[0].__updatedAt > lastDate);
        });
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