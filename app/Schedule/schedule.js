angular.module('aac.schedule.controller', [])

    //EVENT CONTROLLER
.controller('ActivityController', function ($scope, $rootScope, $stateParams, Store, $ionicLoading, $cordovaCalendar, $state) {

    $scope.carga = function () {
        var allEvents = Store.get('AllEvents');
        var event = null;

        var myEvents = Store.get('MyEvents');
        var ids = [];
        myEvents.forEach(function (entry) {
            ids.push(entry.data.id);
        });

        allEvents.forEach(function (entry) {
            if (entry.data.id == $stateParams.Id) {
                entry.checked = false;

                ids.forEach(function (val) {
                    if (val == entry.data.id)
                        entry.checked = true;
                });

                $scope.event = entry;

            }
        });
    };

    $scope.activityClick = function () {
        var mySchedule = Store.get('MyEvents');
        var entry = $scope.event;
        if (!entry.checked) {
            mySchedule.push(entry);
            Store.save('MyEvents', mySchedule);
            entry.checked = !entry.checked;
            var event = entry.data;
            $cordovaCalendar.createEvent(event.title, event.location, event.description, new Date(event.dateStart), new Date(event.dateFinish),
                function (result) {
                    $ionicLoading.show({ template: 'Evento agregado al calendario', noBackdrop: true, duration: 2000 });
                    $state.go("tab.home");
                },
                function (err) {
                    $ionicLoading.show({ template: err, noBackdrop: true, duration: 2000 });
                });
        }
        else {
            mySchedule.push($scope.event);
            Store.remove('MyEvents');
            Store.save('MyEvents', mySchedule);
        }
        $scope.event.checked = !$scope.event.checked;
    };



})
    // SCHEDULE CONTROLLER
.controller('ScheduleController', function ($scope, $rootScope, $ionicSideMenuDelegate, $location,
     Store, WebApiFactory, $cordovaCalendar, $ionicLoading) {

    $scope.getItemWidth = function (item) {
        return '80%';
    };
    $scope.shownGroup = null;

    $scope.pageTitle = "Cronograma";
    $scope.icon = "ion-android-checkmark";

    //AL HACER CLICK EN EL CHECK, GUARDAR EN LOCAL EL EVENTO QUE ASISTIRA
    $scope.activityClick = function (id) {
        var mySchedule = Store.get('MyEvents');
        $scope.events.forEach(function (entry) {
            if (entry.data.id == id) {
                if (!entry.checked) {
                    mySchedule.push(entry);
                    Store.save('MyEvents', mySchedule);
                    entry.checked = !entry.checked;
                    var event = entry.data;
                    $cordovaCalendar.createEvent(event.title, event.location, event.description, new Date(event.dateStart), new Date(event.dateFinish),
                        function (result) {
                            $ionicLoading.show({ template: 'Evento agregado al calendario', noBackdrop: true, duration: 2000 });
                        },
                        function (err) {
                            $ionicLoading.show({ template: err, noBackdrop: true, duration: 2000 });
                        });
                }
                else {
                    mySchedule.forEach(function (value, index) {
                        if (value.data.id == id) {
                            mySchedule.splice(index, 1);
                            Store.save('MyEvents', mySchedule);
                            entry.checked = !entry.checked;
                        }

                    });
                }

            }
        });
    };

    //ACORTAR EL TITULO DEL EVENTO PARA MEJORAR LA VISTA
    $scope.slice = function (title) {
        if (title.length < 50)
            return title;

        var sliced = title.slice(0, 50) + "...";
        return sliced;
    }

    //Busqueda
    $scope.searchQuery = "";
    $scope.showSearchBox = false;
    $scope.isFiltered = true;
    //Carga de filtros lateral
    $scope.filterGroups = [{ name: 'Horario' }, { name: 'Categoria' }, { name: 'Salon' }];
    $scope.radioGroups = { name: 'Fecha' };

    $scope.loadFilterMenu = function (value, filter) {
        var dateAlreadyExists = false;
        var locationAlreadyExists = false;
        var categoryAlreadyExists = false;
        var dateChecked = false;
        var date = new Date();
        if (date.getHours() <= 13) {
            filter.timeFilter = [{ name: "Mañana", checked: true }, { name: "Tarde", checked: false }];
            $scope.timeSelected = filter.timeFilter[0].name;
        }
        else {
            filter.timeFilter = [{ name: "Mañana", checked: false }, { name: "Tarde", checked: true }];
            $scope.timeSelected = filter.timeFilter[1].name;
        }

        //Dates
        filter.datesFilter.forEach(function (dateFilter) {
            if (dateFilter.name == $rootScope.getDate(value.data.dateStart)) {
                dateAlreadyExists = true
            }
            if (dateFilter.checked == true) {
                dateChecked = true;
            }
        });


        if (!dateAlreadyExists) {
            var dateName = $rootScope.getDate(value.data.dateStart)
            var newDate = { name: dateName, checked: false };
            var dateToday = $rootScope.getDate(new Date());
            if (dateToday == dateName) {
                $scope.dateSelected = { name: newDate.name };
            }
            filter.datesFilter.push(newDate);
        }

        if (!dateChecked) {
            var newDate = { name: $rootScope.getDate(value.data.dateStart), checked: false };
            $scope.dateSelected = { name: filter.datesFilter[0].name };
        }

        //Categories
        filter.categoriesFilter.forEach(function (categoryFilter) {
            if (categoryFilter.name == value.data.categoryName) {
                categoryAlreadyExists = true
            }
        });

        if (!categoryAlreadyExists) {
            var newCategory = { name: value.data.categoryName, checked: false };
            filter.categoriesFilter.push(newCategory);
        }

        //Location
        filter.locationsFilter.forEach(function (locationFilter) {
            if (locationFilter.name == value.data.location) {
                locationAlreadyExists = true
            }
        });

        if (!locationAlreadyExists) {
            var newLocation = { name: value.data.location, checked: false };
            filter.locationsFilter.push(newLocation);
        }


        return filter;
    };
    $scope.getItemsFromGroup = function (group) {
        if (group.name == 'Horario') {
            return $scope.filterTime;
        }
        if (group.name == 'Fecha') {
            return $scope.filterDates;
        }
        if (group.name == 'Categoria') {
            return $scope.filterCategories;
        }
        if (group.name == 'Salon') {
            return $scope.filterLocation;
        }

        return null;
    }

    //Carga de eventos inicial
    //COMENTADO PARA HACER PULL AND REFRESH EN EL FUTURO
    $scope.carga = function () {

        var allEvents = [];
        var filter = { timeFilter: [], datesFilter: [], categoriesFilter: [], locationsFilter: [] };
        //WebApiFactory.all('tables/Activity').success(function (activities) {
        //    var data = activities;
        //    data.forEach(function (entry) {
        //        allEvents.push({ data: entry, checked: false })
        //    });
        //}).error(function (data, status) {
        allEvents = Store.get('AllEvents');
        //}).finally(function () {

        var myEvents = Store.get('MyEvents');
        var ids = [];
        myEvents.forEach(function (entry) {
            ids.push(entry.data.id);
        });;

        allEvents.forEach(function (value) {
            value.checked = false;
            ids.forEach(function (val) {
                if (val == value.data.id)
                    value.checked = true;
            });

            filter = $scope.loadFilterMenu(value, filter);
        });

        Store.remove('AllEvents');
        Store.save('AllEvents', allEvents);
        $scope.filterTime = filter.timeFilter;
        $scope.filterDates = filter.datesFilter;
        $scope.filterCategories = filter.categoriesFilter;
        $scope.filterLocation = filter.locationsFilter;
        $scope.events = allEvents;
        $scope.isFiltered = allEvents.length != 0;

        //});
    };
    $scope.carga();

    ///SIDE MENU
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };


    //FILTERS
    $scope.matchDate = function (filterDates) {
        var dateChosen = filterDates;
        return function (event) {
            return dateChosen == $scope.getDate(event.data.dateStart) || dateChosen == "all";
        }
    };
    $scope.matchCategory = function (filterCategories) {
        return function (event) {
            var isMatched = false;
            var allUnchecked = true;
            filterCategories.forEach(function (filter) {
                if (filter.checked)
                { allUnchecked = false }
                if (filter.name == event.data.categoryName && filter.checked == true)
                { isMatched = true }
            });
            if (allUnchecked)
            { return allUnchecked }

            return isMatched;
        }
    };
    $scope.matchLocation = function (filterLocations) {
        return function (event) {
            var isMatched = false;
            var allUnchecked = true;
            filterLocations.forEach(function (filter) {
                if (filter.checked)
                { allUnchecked = false }
                if (filter.name == event.data.location && filter.checked == true)
                { isMatched = true }
            });
            if (allUnchecked)
            { return allUnchecked }

            return isMatched;
        }
    };
    $scope.matchTime = function (filterTime) {
        return function (event) {
            var isMatched = false;
            var allUnchecked = true;
            filterTime.forEach(function (filter) {
                var date = new Date(event.data.dateStart);
                if (filter.checked)
                { allUnchecked = false }
                if ((filter.name == "Mañana" && date.getHours() <= 13 && filter.checked == true) || (filter.name == "Tarde" && date.getHours() > 13 && filter.checked == true))
                { isMatched = true }
            });
            if (allUnchecked)
            { return allUnchecked }

            return isMatched;
        }
    };

    //DESCRIPCION DEL EVENTO
    $scope.goToEvent = function (id) {
        $location.path("/tab/schedule/activity/" + id);
    };


})
    //MY SCHEDULE CONTROLLER
.controller('MyScheduleController', function ($scope, $controller, $rootScope, $ionicSideMenuDelegate, $location, Store, $ionicLoading) {


    $controller('ScheduleController', { $scope: $scope }); //This works

   
    $scope.isFiltered = false;

    //CARGA INICIAL
    $scope.carga = function () {
        var filter = { timeFilter: [], datesFilter: [], categoriesFilter: [], locationsFilter: [] };
        var events = Store.get('MyEvents');

        events.forEach(function (event) {
            filter = $scope.loadFilterMenu(event, filter);
        });

        filter.timeFilter.forEach(function (filter) {
            filter.checked = false;
        })
        $scope.dateSelected.name = "all";
        $scope.filterTime = filter.timeFilter;
        $scope.filterDates = filter.datesFilter;
        $scope.filterCategories = filter.categoriesFilter;
        $scope.filterLocation = filter.locationsFilter;

        return events;
    };
    $scope.events = $scope.carga();



    $scope.pageTitle = "Agenda";
    $scope.icon = "ion-android-alarm";

    //AL HACER CLICK EN EL RELOJ, CONFIGURAR ALARMA
    $scope.activityClick = function (id) {
        $ionicLoading.show({ template: 'Opción no disponible', noBackdrop: true, duration: 2000 });
    };


});



