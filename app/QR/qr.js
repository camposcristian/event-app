angular.module('aac.qr.controller', [])

.controller('QrController', function ($scope, $state, $stateParams, $ionicLoading) {
    
    var id = localStorage["UserId"]
    if (id != null) {
        $scope.qrId = "?data=" + id + "&amp;";

        $scope.qrUrl = "https://api.qrserver.com/v1/create-qr-code/";

        $scope.qrParams = "qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L";
    }
    else {
        $ionicLoading.show({ template: "Debe iniciar sesión para poder continuar", noBackdrop: true, duration: 1000 });
        window.history.back();
        return;
    }


});
