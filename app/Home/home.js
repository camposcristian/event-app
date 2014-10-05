angular.module('aac.home.controller', [])

.controller('NotificationController', function ($scope, $stateParams, Store) {
    var selectedNotification;
    var allNotifications = Store.get('Notifications');
    allNotifications.forEach(function (notif) {
        if (notif.id === $stateParams.Id)
        { selectedNotification = notif; }
    })
    $scope.card = selectedNotification;
})

.controller('HomeController', function ($scope, $state, $location, $cordovaBarcodeScanner, Store, WebApiFactory) {

    $scope.pila1 = [];
    $scope.pila2 = [];

    $scope.scanCode = function () {
        var id = localStorage["UserId"]
        if (id != null) {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                $state.go("tab.participant", { Id: imageData.text, Qr: true });

            }, function (err) {
                $ionicLoading.show({ template: err, noBackdrop: true, duration: 1000 });
                $state.go("tab.home");
                return;
            });
        }
        else {
            $ionicLoading.show({ template: "Debe iniciar sesión para poder continuar", noBackdrop: true, duration: 1000 });
            $state.go("tab.more");
        }
    };

    //CARGA DE DATOS
    $scope.carga = function () {
        var isDeleted = false;
        var allNotifications = [];
        var enabledNotifications = [];
        var removedIds = Store.get('removedIds');
        $scope.hideData = false;
        $scope.hasBanner = false;

        var banner = Store.get('Banner');
        if (banner.length > 0)
        {
            var num = Math.floor(Math.random() * banner.length)
            $scope.bannerUrl = banner[num].bannerImg;
            $scope.hasBanner = true;
        }   


        WebApiFactory.all('tables/NotificationFeedback').success(function (data) {
            allNotifications = data;
        }).error(function (data, status) {
            allNotifications = Store.get('Notifications');
        }).finally(function () {
            if (allNotifications.length > 0) {
                allNotifications.forEach(function (notif) {
                    isDeleted = false;
                    removedIds.forEach(function (id) {
                        if (id.toString() === notif.id) {
                            isDeleted = true;
                        }
                    });
                    if (!isDeleted) {
                        enabledNotifications.push(notif)
                    };
                });

                if (enabledNotifications.length == 0)
                    $scope.hideData = true;

                Store.remove('Notifications');
                Store.save('Notifications', enabledNotifications);
                $scope.pila1 = enabledNotifications;
                var length = $scope.pila1.length;
                if (length > 0) {
                    $scope.card = $scope.pila1[length - 1];
            }

            $scope.cardTypes = enabledNotifications;
            }
            else {
                $scope.hideData = true;
            }
        });
    };

    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.hideData == true) {
            $scope.hideData = true;
        }
        else {
            $scope.hideData = false;
        }

    });

    //BORRAR DATO
    $scope.deleteNotification = function (id) {

        var removed = $scope.pila1.pop();

        var notifications = []
        notifications += $scope.pila2;
        notifications += $scope.pila1;

        Store.remove('Notifications');
        Store.save('Notifications', notifications);

        var removedIds = Store.get('removedIds');
        Store.remove('removedIds');
        removedIds.push(removed.id);
        Store.save('removedIds', removedIds);

        if ($scope.pila1.length === 0) {
            if ($scope.pila2.length === 0) {
                $scope.hideData = true;
            }
            else {
                $scope.pila1.push($scope.pila2.pop())
            }
        }
        $scope.card = $scope.pila1[$scope.pila1.length - 1];
    }

    $scope.doesNotExistElements = function () {
        var allNotifications = Store.get('Notifications');
        return allNotifications.length === 0;
    };

    //ACORTAR EL TITULO DE LA NOTIFICACION PARA MEJORAR LA VISTA
    $scope.slice = function (text) {
        if (text.length < 30)
            return text;

        var sliced = text.slice(0, 30) + "...";
        return sliced;
    };
    $scope.sliceDesc = function (text) {
        if (text.length < 40)
            return text;

        var sliced = text.slice(0, 40) + "...";
        return sliced;
    };


    $scope.goToNotificationDetail = function () {
        var item = $scope.pila1.pop();
        $scope.pila1.push(item);
        $location.path("/tab/home/detail/" + item.id);
    };

    $scope.getImg = function () {
        if($scope.isFeedback($scope.card.userId))
            return "./img/feedbackImg.jpg"
        else 
            return "./img/alertImg.jpg"
    }
    $scope.isFeedback = function (bool) {
        return bool !== 0
    };

    $scope.goRight = function () {
        if ($scope.pila1.length > 1) {
            var item = $scope.pila1.pop();
            $scope.pila2.push(item);
            $scope.card = $scope.pila1[$scope.pila1.length - 1];


        }
    };
    $scope.goLeft = function () {
        if ($scope.pila2.length > 0) {
            var item = $scope.pila2.pop();
            $scope.pila1.push(item);
            $scope.card = $scope.pila1[$scope.pila1.length - 1];

        }
    };
    $scope.areItemsLeft = function () {
        return $scope.pila2.length > 0;
    }
    $scope.areItemsRight = function () {
        return $scope.pila1.length > 1;
    }
});


