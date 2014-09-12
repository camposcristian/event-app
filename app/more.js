angular.module('aac.more.controller', [])

 
.controller('MoreController', function ($scope, $window,$location, ApiFactory, UserProfile) {
    //$scope.logVar;
    var i = 1;
    $scope.isLog=false;
    
    $scope.FunctionLog = function () {
        if (i == 1) {
            //ApiFactory.all('/api/UsersAPI/GetParticipants').success(function () {
            ApiFactory.test().success(function () {
                $scope.isLog = true;
            }).error(function () {
                $scope.isLog = false;
            });
        }
        i = 2;
        
    };
    //ApiFactory.getOwnUser().success(function(user){
    //    $scope.userJson = user;
    //}).error(function (data, status, headers, config) {
    //    console.log('getOwnUser error');
    //    console.log('data');
    //    console.log(data);
    //    console.log('status');
    //    console.log(status);
    //});
    //$scope.userJson = ApiFactory.getUserId();
    ApiFactory.getUserId();
    $scope.goToProfile = function () {
        $location.path("/tab/profile/" + localStorage["UserId"]);
    }
});


angular.module('aac.more.service', [])


.factory('MoreService', function (BaseUrl, ApiFactory, $http) {
    return ApiFactory.test();
});