angular.module('aac.splash.controller', [])

.controller('SplashController', function ($scope, $state, Store, WebApiFactory, $interval, $ionicLoading, $cacheFactory) {
    //Borrar todo lo referido al timer, dejar el go y el loading.
    //var $httpDefaultCache = $cacheFactory.get('$http');
    //$httpDefaultCache.remove("tables/Activity");
    //$httpDefaultCache.remove("tables/NotificationFeedback");
    //En el loading, se podría ir poniendo "cargando notificaciones, cargando actividades, etc"
    $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Sincronizando Actividades', noBackdrop: false });

    WebApiFactory.all('tables/Activity')
        .success(function (activities) {
            var allEvents = [];
            var data = activities;
            data.forEach(function (entry) {
                allEvents.push({ data: entry, checked: false })
            });
            Store.remove('AllEvents');
            Store.save('AllEvents', allEvents);
            $ionicLoading.hide();
        }).error(function (data, status) {
            $ionicLoading.show({ template: 'Error de conexión', noBackdrop: false });
        }).finally(function () {
            $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Sincronizando Sponsors', noBackdrop: false });
            WebApiFactory.all('tables/Sponsor')
                .success(function (allSponsors) {
                    var gold = [];
                    var silver = [];
                    var platinum = [];
                    var banner = [];

                    if (allSponsors.length > 0) {
                        allSponsors.forEach(function (sponsor) {
                            if (sponsor.type === "Platino")
                                platinum.push(sponsor)
                            else if (sponsor.type === "Oro")
                                gold.push(sponsor)
                            else if (sponsor.type === "Plata")
                                silver.push(sponsor)
                            else
                                banner.push(sponsor)
                        });
                    };

                    if (platinum.length > 0) {
                        Store.remove('SponsorsPlatinum');
                        Store.save('SponsorsPlatinum', platinum);
                    }
                    if (gold.length > 0) {
                        Store.remove('SponsorsGold');
                        Store.save('SponsorsGold', gold);
                    }
                    if (silver.length > 0) {
                        Store.remove('SponsorsSilver');
                        Store.save('SponsorsSilver', silver);
                    }
                    if (banner.length > 0) {
                        Store.remove('Banner');
                        Store.save('Banner', banner);
                    }

                })
            .finally(function () {
                $ionicLoading.show({ template: '<i class="icon ion-loading-c"></i><br/>Sincronizando Notificaciones', noBackdrop: false });
                WebApiFactory.all('tables/NotificationFeedback')
                    .success(function (data) {
                        var allNotifications = [];
                        allNotifications = data;
                        Store.remove('Notifications');
                        Store.save('Notifications', allNotifications);
                        Store.save('lastSync', new Date());
                        $ionicLoading.hide();
                    })
                    .error(function (data, status) {
                        $ionicLoading.show({ template: 'Compruebe su conexión a internet y vuelva a intentarlo', noBackdrop: true, duration: 1500 });
                    })
                    .finally(function () {
                        $state.go('tab.home');
                    });
            });
        });
});



