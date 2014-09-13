angular.module('aac.services',
    [
        'aac.schedule.service',
        'aac.login.service',
        'aac.user.service',
        'aac.more.service',
        'aac.home.service'
    ])


.factory('BaseUrl', function () {
    return 'https://aaclupersoft.azurewebsites.net';
    // return 'http://localhost:41222';
})

.factory('Store', function () {
    return {

        get: function (key) {
            var value = localStorage.getItem(key);
            return (value != null) ? JSON.parse(value) : [];
        },

        save: function (key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },

        remove: function (key) {
            localStorage.removeItem(key);
        },

        clearAll: function () {
            localStorage.clear();
        }
    };
})

.factory("ApiFactory", function (BaseUrl, $http) {
    return {
        all: function (Action) {
            return $http.get(BaseUrl + Action, {
                // Set the Authorization header
                headers: {
                    'Authorization': 'Bearer ' + localStorage["token"]
                }
            })
        },
        get: function (Action, Id) {
            return $http.get(BaseUrl + Action + Id, {
                // Set the Authorization header
                headers: {
                    'Authorization': 'Bearer ' + localStorage["token"]
                }
            })
        },

        put: function (Action, Id, Data) {
            return $http.put(BaseUrl + Action + Id, Data
                , {
                    headers: {
                        'Content-Type': "application/json; charset=utf-8",
                        'Authorization': 'Bearer ' + localStorage["token"]
                    }
                }
                )
        },
        post: function (Action, Data) {
            return $http.post(BaseUrl + Action, Data
                , {
                    headers: {
                        'Content-Type': "application/json; charset=utf-8",
                        'Authorization': 'Bearer ' + localStorage["token"]
                    }
                }
                )
        },
        test: function () {
            return $http.get(BaseUrl + '/api/UsersAPI/TestConnection', {
                // Set the Authorization header
                headers: {
                    'Authorization': 'Bearer ' + localStorage["token"]
                }
            })
        },
        getUserId: function () {
            $http.get(BaseUrl + '/api/UsersAPI/GetOwnUser', {
                // Set the Authorization header
                headers: {
                    'Authorization': 'Bearer ' + localStorage["token"]
                }
            }).success(function (user) {
                localStorage["UserId"] = user.Id;
                return user.User.Id;
            }).error(function (data, status, headers, config) {
                console.log('getOwnUser error');
                console.log('data');
                console.log(data);
                console.log('status');
                console.log(status);
                console.log('headers');
                console.log(headers);
                console.log('config');
                console.log(config);
                return "error";
            });
        }

    }

})


.factory('BaseUrlAPI', function () {
    return 'http://aaclupersoft.azure-mobile.net/'; CAMBIAR
    // return 'http://localhost:59484/';
})

.factory('WebApiToken', function () {
    return 'KHowdnjynaNRkdltrcAfOHHeSebmsh62 ';
})


.factory("WebApiFactory", function (BaseUrlAPI, WebApiToken, $http) {
    return {
        all: function (Action) {
            return $http.get(BaseUrlAPI + Action, {
                headers: {
                    'x-zumo-application': WebApiToken + localStorage["token"]
                }
            })
        },
        get: function (Action, Id) {
            return $http.get(BaseUrlAPI + Action + Id, {
                headers: {
                    'x-zumo-application': WebApiToken + localStorage["token"]
                }
            })
        },

        put: function (Action, Id, Data) {
            return $http.put(BaseUrlAPI + Action + Id, Data, {
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                    'x-zumo-application': WebApiToken + localStorage["token"]
                }
            })
        },
        post: function (Action, Data) {
            return $http.post(BaseUrlAPI + Action, Data, {
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                    'x-zumo-application': WebApiToken + localStorage["token"]
                }
            })
        }
    }
});