angular.module('aac.splash.controller', [])

.controller('SplashController', function ($scope, $state, Store, WebApiFactory, $interval, $ionicLoading, $cacheFactory) {
    //Borrar todo lo referido al timer, dejar el go y el loading.
    var countDown = 2;
    var $httpDefaultCache = $cacheFactory.get('$http');
    $httpDefaultCache.remove("tables/Activity");
    $httpDefaultCache.remove("tables/NotificationFeedback");
    var timer = $interval(function () {
        //En el loading, se podría ir poniendo "cargando notificaciones, cargando actividades, etc"
        $ionicLoading.show({ template:'<i class="icon ion-loading-c"></i><br/>'+countDown--, noBackdrop: false, duration: 6000 });
        if (countDown < 0) {
            $ionicLoading.hide();
            $state.go('tab.home');
            $interval.cancel(timer);
        }
    }, 1000, 0);

});



