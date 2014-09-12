angular.module('aac.search.controller', [])


.controller('SearchController', function ($scope) {

    $scope.searchQuery = "";

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
    };
})
