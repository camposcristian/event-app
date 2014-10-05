angular.module('aac.services',
    [
        'aac.login.service',
        'aac.user.service',
        'aac.more.service',
    ])


.factory('BaseUrl', function () {
    return 'https://aaclupersoft.azurewebsites.net';
    //return 'http://localhost:41222';
    //return 'http://192.168.1.39:41222';

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
                cache: true,
                headers: {
                    
                    'Authorization': 'Bearer ' + localStorage["token"]
                }
            })
        },
        get: function (Action, Id) {
            return $http.get(BaseUrl + Action + Id, {
                //cache: true,
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
                cache: true,
                // Set the Authorization header
                headers: {
                    'Authorization': 'Bearer ' + localStorage["token"]
                }
            }).success(function (user) {
                localStorage["UserId"] = user.Id;
                return user.Id;
            }).error(function (data, status, headers, config) {

                return "error";
            });
        },
        postPicture: function (Data) {
            return $http.post(BaseUrl + '/api/UsersAPI/PostUserPicture2', { 'data': Data, fileName: "test file.jpg" }
                , {
                    headers: {
                        //'Content-Type': " multipart/form-data; boundary=----WebKitFormBoundaryE6R2pWDTCZQhYncw ",
                        'Content-Type': "application/json; charset=utf-8",
                        'Authorization': 'Bearer ' + localStorage["token"]
                    }
                }
                ).success(function (data) {
                }).error(function (data, status, headers, config) {

                });
        }

    }

})

.factory('BaseUrlAPI', function () {
    return 'http://aaclupersoft.azure-mobile.net/';
    //return 'http://localhost:59484/';
})

.factory('WebApiToken', function () {
    return 'KHowdnjynaNRkdltrcAfOHHeSebmsh62';
})


.factory("WebApiFactory", function (BaseUrlAPI, WebApiToken, $http) {
    return {
        all: function (Action) {
            return $http.get(BaseUrlAPI + Action, {
                headers: {
                    'x-zumo-application': WebApiToken
                }
            })
        },
        get: function (Action, Id) {
            return $http.get(BaseUrlAPI + Action + Id, {
                headers: {
                    'x-zumo-application': WebApiToken
                }
            })
        },

        put: function (Action, Id, Data) {
            return $http.put(BaseUrlAPI + Action + Id, Data, {
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                    'x-zumo-application': WebApiToken
                }
            })
        },
        post: function (Action, Data) {
            return $http.post(BaseUrlAPI + Action, Data, {
                headers: {
                    'Content-Type': "application/json; charset=utf-8",
                    'x-zumo-application': WebApiToken
                }
            })
        }
    }
})

.service('ScrollRender', function () {
    this.render = function (content) {
        return (function (global) {

            var docStyle = document.documentElement.style;

            var engine;
            if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
                engine = 'presto';
            } else if ('MozAppearance' in docStyle) {
                engine = 'gecko';
            } else if ('WebkitAppearance' in docStyle) {
                engine = 'webkit';
            } else if (typeof navigator.cpuClass === 'string') {
                engine = 'trident';
            }

            var vendorPrefix = {
                trident: 'ms',
                gecko: 'Moz',
                webkit: 'Webkit',
                presto: 'O'
            }[engine];

            var helperElem = document.createElement("div");
            var undef;

            var perspectiveProperty = vendorPrefix + "Perspective";
            var transformProperty = vendorPrefix + "Transform";

            if (helperElem.style[perspectiveProperty] !== undef) {

                return function (left, top, zoom) {
                    content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
                };

            } else if (helperElem.style[transformProperty] !== undef) {

                return function (left, top, zoom) {
                    content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
                };

            } else {

                return function (left, top, zoom) {
                    content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
                    content.style.marginTop = top ? (-top / zoom) + 'px' : '';
                    content.style.zoom = zoom || '';
                };

            }
        })(this);
    };

})

.directive('zoomable', function (ScrollRender) {
    return {
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                // Intialize layout
                var container = document.getElementById("container");
                var content = document.getElementById("content");
                var clientWidth = 0;
                var clientHeight = 0;

                // Initialize scroller
                var scroller = new Scroller(ScrollRender.render(content), {
                    scrollingX: true,
                    scrollingY: true,
                    animating: true,
                    bouncing: true,
                    locking: true,
                    zooming: true,
                    minZoom: 0.5,
                    maxZoom: 2
                });

                // Initialize scrolling rect
                var rect = container.getBoundingClientRect();
                scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);

                var image = document.getElementById('image-scrollable');
                var contentWidth = image.width;
                var contentHeight = image.height;

                // Reflow handling
                var reflow = function () {
                    clientWidth = container.clientWidth;
                    clientHeight = container.clientHeight;
                    scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
                };


                window.addEventListener("resize", reflow, false);
                reflow();

                if ('ontouchstart' in window) {

                    container.addEventListener("touchstart", function (e) {
                        // Don't react if initial down happens on a form element
                        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }

                        scroller.doTouchStart(e.touches, e.timeStamp);
                        e.preventDefault();
                    }, false);

                    document.addEventListener("touchmove", function (e) {
                        scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                    }, false);

                    document.addEventListener("touchend", function (e) {
                        scroller.doTouchEnd(e.timeStamp);
                    }, false);

                    document.addEventListener("touchcancel", function (e) {
                        scroller.doTouchEnd(e.timeStamp);
                    }, false);

                } else {

                    var mousedown = false;

                    container.addEventListener("mousedown", function (e) {
                        if (e.target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }

                        scroller.doTouchStart([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mousemove", function (e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchMove([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mouseup", function (e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchEnd(e.timeStamp);

                        mousedown = false;
                    }, false);

                    container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", function (e) {
                        scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
                    }, false);
                }
            });
        }
    };
});