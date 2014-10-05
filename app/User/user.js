angular.module('aac.user.controller', [])

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}])
 //EditUser Controller
.controller('EditUserController', function ($scope, $stateParams, $window, $ionicPopup, ParticipantsLister, UserProfile, $cordovaCamera, $ionicLoading, ApiFactory) {
    $scope.$watch('$viewContentLoaded', function () {


        $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Cargando', noBackdrop: false, duration: 5000 });


        ParticipantsLister.get($stateParams.Id).success(function (user) {
            $ionicLoading.hide();
            $scope.user = user;
            if ($scope.user.Image != null) {
                $scope.ImageURI = $scope.user.Image;
            }
            else {
                $scope.ImageURI = "./img/profileImage.png";
            }


        });




    });



    $scope.uploadme = {};
    $scope.uploadme.src = "img/profileImage.png";
    $scope.cargarImg2 = function () {
        takePicture2.click();
    }
    $scope.cargarImg = function () {
        var options = {
            quality: 50,
            //destinationType: Camera.DestinationType.FILE_URI,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY

        };
        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.ImageURI = "data:image/jpeg;base64," + imageURI;
        });
    }
    $scope.showButton = false;
    $scope.changeShowButton = function () {
        $scope.showButton = true;
    }



    $scope.goBack = function (id) {
        $window.history.back();
    };

    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Editar Perfil',
            template: '¿Estas seguro que deseas realizar estos cambios?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Cargando', noBackdrop: false, duration: 5000 });

                if ($scope.ImageURI != "./img/profileImage.png") {
                    var imagen = $scope.ImageURI;
                    var fotoAenviar = imagen.substring(imagen.indexOf(',') + 1);
                    ApiFactory.postPicture(fotoAenviar);
                    $scope.user.Image = "https://aaclupersoft.blob.core.windows.net/profilepictures/" + $scope.user.Id;
                }

                ParticipantsLister.put($stateParams.Id, $scope.user).success(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    $window.history.back();
                }).error(function (data, status, headers, config) {

                });

            } else {
                console.log('You are not sure');
            }
        });
    };

})

    //PARTICIPANT CONTROLLER
.controller('UserController', function ($scope, $state, $stateParams, $cacheFactory, $location, ApiFactory, ParticipantsLister, $ionicLoading, UserProfile, $cordovaContacts) {

    $scope.$watch('$viewContentLoaded', function () {

        var $httpDefaultCache = $cacheFactory.get('$http');
        $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Cargando', noBackdrop: false, duration: 5000 });


        ParticipantsLister.get($stateParams.Id).success(function (user) {
            $ionicLoading.hide();
            $scope.user = user;
            $scope.profileImage = $scope.user.Image;
            if (!!$scope.profileImage) {
                return;
            }
            else {
                $scope.profileImage = "./img/profileImage.png";
            }
            $scope.$apply(function () {
                $scope.profileImage = profileImage + '?' + new Date().getTime();
            });
        });


    });


    $scope.isQr = $stateParams.Qr || false;
    $scope.isProfile = (localStorage["UserId"] == $stateParams.Id);

    $scope.goToEditUser = function (Id) {
        $location.path("/tab/editUser/" + $stateParams.Id);
    };
    $scope.addContact = function () {
        var properties = {
            displayName: $scope.user.CompleteName,
            name: { formatted: $scope.user.CompleteName, givenName: $scope.user.CompleteName },
            phoneNumbers: [new ContactField('home', $scope.user.Tel, false)],
            emails: [new ContactField('home', $scope.user.Email, false)]
        }
        $cordovaContacts.save(properties).then
            (function (result) {
                $ionicLoading.show({ template: 'Contacto Agregado a la Agenda', noBackdrop: true, duration: 2000 });
                $state.go("tab.home");
            },
        function (err) {
            $ionicLoading.show({ template: err, noBackdrop: true, duration: 2000 });

        });
    };
    $scope.getToken = function () {
        return localStorage["token"];

    };


})

.controller('ParticipantsController', function ($scope, $ionicSideMenuDelegate, $location, $ionicLoading, $cacheFactory, ParticipantsLister) {

    $scope.$watch('$viewContentLoaded', function () {

        var $httpDefaultCache = $cacheFactory.get('$http');
        $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Cargando', noBackdrop: false, duration: 5000 });


        ParticipantsLister.all().success(function (participants) {
            $ionicLoading.hide();
            $scope.participants = participants;
            $scope.participants.forEach(function (participant) {
                if (participant.Image == null) {
                    participant.Image = "./img/profileImage.png";
                }

            });
        });
    });

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

    };






});



///////////////////////////////////////////////////////////////////////////////////////////////////////

angular.module('aac.user.service', [])


.factory('ParticipantsLister', function (BaseUrl, ApiFactory, $http, $cacheFactory) {

    return {
        all: function () {
            return ApiFactory.all('/api/UsersAPI/GetParticipants');

        },
        get: function (Id) {
            return ApiFactory.get('/api/UsersAPI/GetUser/', Id);

        },

        put: function (Id, User) {
            var $httpDefaultCache = $cacheFactory.get('$http');
            return ApiFactory.put('/api/UsersAPI/PutUser/', Id, User).success(function () {
                $httpDefaultCache.remove("/api/UsersAPI/GetUser/");
                $httpDefaultCache.remove("/api/UsersAPI/GetParticipants/");
            });
        }


    }
})

.factory('UserProfile', function (ApiFactory, BaseUrl, $http) {

    return {
        isProfile: function (Id) {
            var profileId = ApiFactory.getUserId();
            if (Id == localStorage["UserId"]) {
                return true;
            } else {
                return false;
            }
        }
    }

});