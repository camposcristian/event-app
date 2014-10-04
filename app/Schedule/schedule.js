angular.module('aac.schedule.controller', [])

    //EVENT CONTROLLER
.controller('ActivityController', function ($scope, $stateParams, Store) {
    $scope.getMyEvent = function () {
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

                event = entry;

            }
        });

        return event;
    };
    $scope.event = $scope.getMyEvent();


    $scope.activityClick = function () {
        var mySchedule = Store.get('MyEvents');
        if ($scope.event.checked) {
            mySchedule.forEach(function (entry, index) {
                if (entry.data.id == $scope.event.data.id) {
                    mySchedule.splice(index, 1);
                    Store.remove('MyEvents');
                    Store.save('MyEvents', mySchedule);
                }

            });
        }
        else {
            mySchedule.push($scope.event);
            Store.remove('MyEvents');
            Store.save('MyEvents', mySchedule);
        }

        $scope.event.checked = !$scope.event.checked;

    };

    //DATETIME PARSERS
    $scope.getDate = function (dateTime) {
        var date = new Date(dateTime);
        var stringDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        return stringDate;
    };
    $scope.getInitTime = function (dateTime) {
        var date = new Date(dateTime);
        var stringTime = $scope.getTime(date.getHours()) + ':' + $scope.getTime(date.getMinutes());
        return stringTime;
    };
    $scope.getEndTime = function (dateTime) {
        var date = new Date(dateTime);
        var stringTime = $scope.getTime(date.getHours()) + ':' + $scope.getTime(date.getMinutes());
        return stringTime;
    };
    $scope.getTime = function (mins) {
        if (mins < 10)
        { mins = '0' + mins; }

        return mins;
    };

})
    // SCHEDULE CONTROLLER
.controller('ScheduleController', function ($scope, $ionicSideMenuDelegate, $location,
    Events, Store, WebApiFactory, $cordovaCalendar, $ionicLoading) {


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

    //Carga de filtros lateral
    $scope.filterGroups = [{ name: 'Fecha' }, { name: 'Categoria' }, { name: 'Salon' }];
    $scope.loadFilterMenu = function (value, filter) {
        var dateAlreadyExists = false;
        var locationAlreadyExists = false;
        var categoryAlreadyExists = false;

        //Dates
        filter.datesFilter.forEach(function (dateFilter) {
            if (dateFilter.name == $scope.getDate(value.data.dateStart)) {
                dateAlreadyExists = true
            }
        });

        if (!dateAlreadyExists) {
            var newDate = { name: $scope.getDate(value.data.dateStart), checked: false };
            filter.datesFilter.push(newDate);
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
    $scope.carga = function () {

        var allEvents = [];
        var filter = { datesFilter: [], categoriesFilter: [], locationsFilter: [] };
        WebApiFactory.all('tables/Activity').success(function (activities) {
            var data = activities;
            data.forEach(function (entry) {
                allEvents.push({ data: entry, checked: false })
            });
        }).error(function (data, status) {
            allEvents = Store.get('AllEvents');
        }).finally(function () {


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

            $scope.filterDates = filter.datesFilter;
            $scope.filterCategories = filter.categoriesFilter;
            $scope.filterLocation = filter.locationsFilter;

            $scope.events = allEvents;
        });
    };
    $scope.events = $scope.carga();

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

    //DATETIME PARSERS
    $scope.getDate = function (dateTime) {
        var date = new Date(dateTime);
        var stringDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        return stringDate;
    };
    $scope.getInitTime = function (dateTime) {
        var date = new Date(dateTime);
        var stringTime = $scope.getTime(date.getHours()) + ':' + $scope.getTime(date.getMinutes());
        return stringTime;
    };
    $scope.getEndTime = function (dateTime) {
        var date = new Date(dateTime);
        var stringTime = $scope.getTime(date.getHours()) + ':' + $scope.getTime(date.getMinutes());
        return stringTime;
    };
    $scope.getTime = function (mins) {
        if (mins < 10)
        { mins = '0' + mins; }

        return mins;
    };

    //FILTERS
    $scope.matchDate = function (filterDates) {
        return function (event) {
            var isMatched = false;
            var allUnchecked = true;
            filterDates.forEach(function (filter) {
                if (filter.checked)
                { allUnchecked = false }
                if (filter.name == $scope.getDate(event.data.dateStart) && filter.checked == true)
                { isMatched = true }
            });
            if (allUnchecked)
            { return allUnchecked }

            return isMatched;
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

    //DESCRIPCION DEL EVENTO
    $scope.goToEvent = function (id) {
        $location.path("/tab/schedule/activity/" + id);
    };


})
    //MY SCHEDULE CONTROLLER
.controller('MyScheduleController', function ($scope, $ionicSideMenuDelegate, $location, Store) {

    $scope.pageTitle = "Agenda";
    $scope.icon = "ion-android-alarm";


    //AL HACER CLICK EN EL RELOJ, CONFIGURAR ALARMA
    $scope.activityClick = function (id) {
    };

    //DATETIME PARSERS
    $scope.getDate = function (dateTime) {
        var date = new Date(dateTime);
        var stringDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        return stringDate;
    };
    $scope.getInitTime = function (dateTime) {
        var date = new Date(dateTime);
        var stringTime = $scope.getTime(date.getHours()) + ':' + $scope.getTime(date.getMinutes());
        return stringTime;
    };
    $scope.getEndTime = function (dateTime) {
        var date = new Date(dateTime);
        var stringTime = $scope.getTime(date.getHours()) + ':' + $scope.getTime(date.getMinutes());
        return stringTime;
    };
    $scope.getTime = function (mins) {
        if (mins < 10)
        { mins = '0' + mins; }

        return mins;
    };


    //Busqueda
    $scope.searchQuery = "";
    $scope.showSearchBox = false;

    //Carga de filtros lateral
    $scope.filterGroups = [{ name: 'Fecha' }, { name: 'Categoria' }, { name: 'Salon' }];
    $scope.loadFilterMenu = function (value, filter) {
        var dateAlreadyExists = false;
        var locationAlreadyExists = false;
        var categoryAlreadyExists = false;

        //Dates
        filter.datesFilter.forEach(function (dateFilter) {
            if (dateFilter.name == $scope.getDate(value.data.dateStart)) {
                dateAlreadyExists = true
            }
        });

        if (!dateAlreadyExists) {
            var newDate = { name: $scope.getDate(value.data.dateStart), checked: false };
            filter.datesFilter.push(newDate);
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

    //CARGA INICIAL
    $scope.carga = function () {
        var filter = { datesFilter: [], categoriesFilter: [], locationsFilter: [] };
        var events = Store.get('MyEvents');

        events.forEach(function (event) {
            filter = $scope.loadFilterMenu(event, filter);
        });

        $scope.filterDates = filter.datesFilter;
        $scope.filterCategories = filter.categoriesFilter;
        $scope.filterLocation = filter.locationsFilter;

        return events;
    };
    $scope.events = $scope.carga();


    //ACORTAR EL TITULO DEL EVENTO PARA MEJORAR LA VISTA
    $scope.slice = function (title) {
        if (title.length < 50)
            return title;

        var sliced = title.slice(0, 50) + "...";
        return sliced;
    }



    //FILTERS
    $scope.matchDate = function (filterDates) {
        return function (event) {
            var isMatched = false;
            var allUnchecked = true;
            filterDates.forEach(function (filter) {
                if (filter.checked)
                { allUnchecked = false }
                if (filter.name == $scope.getDate(event.data.dateStart) && filter.checked == true)
                { isMatched = true }
            });
            if (allUnchecked)
            { return allUnchecked }

            return isMatched;
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



    //SIDE MENU
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


    //GO TO ACTIVITY DETAILS
    $scope.goToEvent = function (id) {
        $location.path("/tab/mySchedule/activity/" + id);
    };
});


///////////////////////////////////////////////////////////////////////////////////////////////////////

angular.module('aac.schedule.service', [])

.factory('Events', function () {
    var events = [
      { id: 0, date: '17/5/2014', initTime: '10:00', endTime: '11.30', title: 'ENTRENAMIENTO Y EVALUACION DEL CIRUJANO EN FORMACION', description: 'descripcion de la charla sobre piernas', category: 'Cirugia de piernas relleno de espacio para ver responsive', location: 'Salon P', exhibitor: [{ completeName: 'Guido Wagner' }], color: "#fff" },
      { id: 1, date: '17/5/2014', initTime: '11:30', endTime: '12.30', title: 'Charla sobre brazos', description: 'descripcion de la charla sobre brazos', category: 'Cirugia de brazos', location: 'Salon Q', exhibitor: [{ completeName: 'Cristian Campos' }], color: "#000" },
      { id: 2, date: '18/5/2014', initTime: '11:00', endTime: '12.30', title: 'DESAFIOS EN EL DIAGNOSTICO Y MEDICINA PERSONALIZADA EN CANCER DE PULMON: IMPACTO EN LOS REQUISITOS DE LA MUESTRA - ROL DEL CIRUJANO TORACICO', description: 'descripcion de la charla sobre dedos del pie,descripcion de la charla sobre dedos del pie,descripcion de la charla sobre dedos del pie,descripcion de la charla sobre dedos del pie,descripcion de la charla sobre dedos del pie', category: 'Cirugia de piernas', location: 'Salon R', exhibitor: [{ completeName: 'Axel Pompa' }, { completeName: 'Naomi Passarelli' }, { completeName: 'Victoria Gonzales' }], color: "#f53" },
      { id: 3, date: '19/5/2014', initTime: '12:30', endTime: '14.00', title: 'Charla sobre cabeza', description: 'descripcion de la charla sobre cabeza', category: 'Cirugia de cabeza', location: 'Salon P', exhibitor: [{ completeName: 'Gabriel Pan Gantes' }], color: "#874" },
      { id: 4, date: '19/5/2014', initTime: '11:00', endTime: '12.30', title: 'LA SUPERVISION Y LA EVALUACION DE LOS RESIDENTES DE CIRUGIA GENERAL:PRACTICAS ACTUALES Y DESAFIOS FUTUROS', description: 'descripcion de la charla sobre dedos del pie', category: 'Cirugia de piernas', location: 'Salon R', exhibitor: [{ completeName: 'Mariano German' }], color: "#F48" }
    ];

    return {
        all: function () {
            return events;
        },
        get: function (Id) {
            // Simple index lookup
            return events[Id];
        }
    }
});
