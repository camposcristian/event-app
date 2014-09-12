angular.module('aac.qr.controller', [])

.controller('QrController', function ($scope, $stateParams) {

    $scope.id = $stateParams.Id;

});
