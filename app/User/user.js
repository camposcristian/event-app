angular.module('aac.user.controller', [])

 //EditUser Controller
.controller('EditUserController', function ($scope, $stateParams, $window, $ionicPopup, ParticipantsLister, UserProfile) {
    //$scope.user = ParticipantsLister.get($stateParams.Id);
    ParticipantsLister.get($stateParams.Id).success(function (user) {
        $scope.user = user;
    });
    $scope.isProfile = UserProfile.isProfile($stateParams.Id);
    //    function () {
    //    UserService.isProfile($stateParams.Id);
    //}
    $scope.goBack = function (id) {
        $window.history.back();
        //$location.path("/tab/more/");
    };
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Editar Perfil',
            template: '¿Estas seguro que deseas realizar estos cambios?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                ParticipantsLister.put($stateParams.Id, $scope.user).success(function (data, status, headers, config) {
                    console.log('put success');
                    $window.history.back();
                }).error(function (data, status, headers, config) {
                    console.log('post error');
                    console.log('data');
                    console.log(data);
                    console.log('status');
                    console.log(status);
                    console.log('headers');
                    console.log(headers);
                    console.log('config');
                    console.log(config);
                    
                    //$window.history.back();
                });

            } else {
                console.log('You are not sure');
            }
        });
    };
    

})

    //PARTICIPANT CONTROLLER
.controller('UserController', function ($scope, $stateParams, $location, ParticipantsLister, UserProfile) {
    //$scope.user = ParticipantsLister.get($stateParams.Id);
    ParticipantsLister.get($stateParams.Id).success(function (user) {
        $scope.user = user;
    });

    $scope.isProfile = UserProfile.isProfile($stateParams.Id);
    //    function () {
    //    UserService.isProfile($stateParams.Id);
    //}
    $scope.goToEditUser = function (Id) {
        $location.path("/tab/editUser/" + $stateParams.Id);
    };
    $scope.getToken = function () {
        return localStorage["token"];
        //$location.path("/tab/more/");
    };

    var i = 1;
    $scope.isLog = false;

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

})

.controller('ParticipantsController', function ($scope, $ionicSideMenuDelegate, $location, ParticipantsLister) {

    ParticipantsLister.all().success(function (participants) {
        $scope.participants = participants;
    });
    //$scope.participants = ParticipantsLister.all();

    $scope.goToParticipant = function (id) {
        $location.path("/tab/participants/participant/" + id);
    };
    $scope.showSearchBox = false;
    $scope.searchQuery = "";
    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        ParticipantsLister.all().success(function (list) {
            $scope.participants = list.participantes.rows;
        });
        //$scope.participants = ParticipantsLister.all();
    };


});



///////////////////////////////////////////////////////////////////////////////////////////////////////

angular.module('aac.user.service', [])


.factory('ParticipantsLister', function (BaseUrl, ApiFactory, $http) {

    return {
        all: function () {
            return ApiFactory.all('/api/UsersAPI/GetParticipants');
            //return $http.get(BaseUrl + '/api/UsersAPI/GetParticipants', {
            //    // Set the Authorization header
            //    headers: {
            //        'Authorization': 'Bearer ' + localStorage["token"]
            //    }
            //})
        },
        get: function (Id) {
            return ApiFactory.get('/api/UsersAPI/GetUser/', Id);
            //return $http.get(BaseUrl + '/api/UsersAPI/GetUser/' + Id, {
            //    // Set the Authorization header
            //    headers: {
            //        'Authorization': 'Bearer ' + localStorage["token"]
            //    }
            //})
        },

        put: function (Id, User) {
            return ApiFactory.put('/api/UsersAPI/PutUser/', Id, User);
            //return $http.put(BaseUrl + '/api/UsersAPI/PutUser/' + Id, User
            //    , {
            //        headers: {
            //            'Content-Type': "application/json; charset=utf-8",
            //            'Authorization': 'Bearer ' + localStorage["token"]
            //        }
            //    }
            //    )
        }


    }
})

.factory('UserProfile', function (ApiFactory, BaseUrl, $http) {
    
    return {
        isProfile: function (Id) {
            var profileId = ApiFactory.getUserId();
            //var profileId = 1;
            if (Id == localStorage["UserId"]) {
                return true;
            } else {
                return false;
            }
        }
    }

});