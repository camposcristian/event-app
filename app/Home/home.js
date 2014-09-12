angular.module('aac.home.controller',[])

.controller('HomeController', function ($scope, $location, $ionicSlideBoxDelegate, $cordovaBarcodeScanner,Store, WebApiFactory) {

    //SLIDER
    $scope.next = function () {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
        $ionicSlideBoxDelegate.previous();
    };
    $scope.slideChanged = function () {
        $ionicSlideBoxDelegate.update();
    }
    $scope.scanCode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
            alert(imageData)
            // Success! Barcode data is here


        }, function (err) {
            alert(imageData)

            // An error occured. Show a message to the user

        });
    };

    //CARGA DE DATOS
    $scope.carga = function () {
        var isDeleted = false;
        var allNotifications = [];
        var enabledNotifications = [];
        var removedIds = Store.get('removedIds');

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

                Store.remove('Notifications');
                Store.save('Notifications', enabledNotifications);
            }

            $scope.cardTypes = enabledNotifications;
            var slider = $ionicSlideBoxDelegate.$getByHandle('theSlider');
            slider.update();

        });
    };
    $scope.cardTypes = $scope.carga();

    //BORRAR DATO
    $scope.deleteNotification = function (id) {

        var slider = $ionicSlideBoxDelegate.$getByHandle('theSlider');
        var curIndex = slider.currentIndex();
        $scope.cardTypes.splice(curIndex, 1);
        Store.remove('Notifications');
        Store.save('Notifications', $scope.cardTypes);

        var removedIds = Store.get('removedIds');
        Store.remove('removedIds');
        removedIds.push(id);
        Store.save('removedIds', removedIds);

        $scope.cardTypes = $scope.carga();

        var length = slider.slidesCount();

        slider.update();

        if (curIndex === (length - 1) && length > 0) {
            slider.slide(curIndex - 1);
        }
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
    }
    $scope.sliceDesc = function (text) {
        if (text.length < 40)
            return text;

        var sliced = text.slice(0, 40) + "...";
        return sliced;
    }


    $scope.goToNotificationDetail = function (id) {
        $location.path("/tab/home/detail/" + id);
    };
})

.controller('NotificationController', function ($scope, $stateParams, Store) {
    var selectedNotification;
    var allNotifications = Store.get('Notifications');
    allNotifications.forEach( function (notif) {
        if(notif.id === $stateParams.Id)
        { selectedNotification = notif; }       
    })
    $scope.card = selectedNotification;
})

angular.module('aac.home.service', [])

.factory('Slider', function () {
    var cardTypes = [
      { id: 0, title: 'Titulo 1', description: 'Descripcion 1', priority: 1, activity: 'Actividad', speaker: 'Mariano' },
      { id: 1, title: 'Titulo 2', description: 'Descripcion 2', priority: 3, activity: 'Actividad 2', speaker: 'Axel' },
      { id: 2, title: 'Titulo 3', description: 'Descripcion 3', priority: 2, activity: '', speaker: 'null' },
      { id: 3, title: 'Titulo 4', description: 'Descripcion 4', priority: 1, activity: 'Actividad 3', speaker: 'Cristian' },
      { id: 4, title: 'Titulo 5', description: 'Descripcion 5', priority: 3, activity: '', speaker: 'null' }
    ];

    return {
        all: function () {
            return cardTypes;
        },
        get: function (Id) {
            // Simple index lookup
            return cardTypes[Id];
        }
    }
});