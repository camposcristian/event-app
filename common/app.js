// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('aac', ['ionic', 'aac.controllers', 'aac.services', 'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      // setup an abstract state for the tabs directive

          .state('splash', {
              url: '/splash',
              templateUrl: 'app/Splash/splash.html',
              controller: 'SplashController'
          })

      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "app/tabs.html"
      })

      // Each tab has its own nav history stack:

          .state('tab.home', {
              url: '/home',
              views: {
                  'home': {
                      templateUrl: 'app/Home/home.html',
                      controller: 'HomeController'
                  }
              }
          })
        .state('tab.qr', {
            url: '/home/qr',
            views: {
                'home': {
                    templateUrl: 'app/QR/qr.html',
                    controller: 'QrController'
                }
            }
        })
          .state('tab.notificationDetail', {
              url: '/home/detail/:Id',
              views: {
                  'home': {
                      templateUrl: 'app/Home/notificationDetail.html',
                      controller: 'NotificationController'
                  }
              }
          })

         .state('tab.mySchedule', {
             url: '/mySchedule',
             views: {
                 'mySchedule': {
                     templateUrl: 'app/Schedule/schedule.html',
                     controller: 'MyScheduleController'
                 }
             }
         })

          .state('tab.schedule', {
              url: '/schedule',
              views: {
                  'schedule': {
                      templateUrl: 'app/Schedule/schedule.html',
                      controller: 'ScheduleController'
                  }
              }
          })

        .state('tab.notes', {
            url: '/notes',
            views: {
                'notes': {
                    templateUrl: 'app/Notes/noteList.html',
                    controller: 'NotesController'
                }

            }
        })

        .state('tab.note', {
            url: '/notes/:Index',
            views: {
                'notes': {
                    templateUrl: 'app/Notes/note.html',
                    controller: 'NoteController'
                }

            }
        })

          .state('tab.more', {
              url: '/more',
              views: {
                  'more': {
                      templateUrl: 'app/more.html',
                      controller: 'MoreController'
                  }
              }
          })


        .state('tab.map', {
            url: '/map',
            views: {
                'more': {
                    templateUrl: 'app/Map/map.html',
                    controller: 'MapController'
                }
            }
        })

        .state('tab.login', {
            url: '/login',
            views: {
                'more': {
                    templateUrl: 'app/Login/login.html',
                    controller: 'LoginController'
                }
            }
        })

        .state('tab.participants', {
            url: '/participants',
            views: {
                'more': {
                    templateUrl: 'app/User/participants.html',
                    controller: 'ParticipantsController'
                }
            }
        })

        .state('tab.participant', {
            url: '/participants/participant/:Id?Qr',
            views: {
                'more': {
                    templateUrl: 'app/User/user.html',
                    controller: 'UserController'
                }
            }
        })

        .state('tab.profile', {
            url: '/profile/:Id',
            views: {
                'more': {
                    templateUrl: 'app/User/user.html',
                    controller: 'UserController'
                }
            }
        })

        .state('tab.editUser', {
            url: '/editUser/:Id',
            views: {
                'more': {
                    templateUrl: 'app/User/edituser.html',
                    controller: 'EditUserController'
                }
            }
        })

        .state('tab.activity', {
            url: '/schedule/activity/:Id',
            views: {
                'schedule': {
                    templateUrl: 'app/Schedule/activity.html',
                    controller: 'ActivityController'
                }
            }
        })

    .state('tab.activity2', {
        url: '/mySchedule/activity/:Id',
        views: {
            'mySchedule': {
                templateUrl: 'app/Schedule/activity.html',
                controller: 'ActivityController'
            }
        }
    })

    .state('tab.sponsorsType', {
        url: '/sponsorsType',
        views: {
            'more': {
                templateUrl: 'app/Sponsor/SponsorsType.html',
                controller: 'SponsorsTypeController'
            }
        }
    })

    .state('tab.sponsorPlatinum', {
        url: '/sponsorPlatinum',
        views: {
            'more': {
                templateUrl: 'app/Sponsor/Sponsors.html',
                controller: 'SponsorPlatinumController'
            }
        }
    })
        .state('tab.sponsorGold', {
            url: '/sponsorGold',
            views: {
                'more': {
                    templateUrl: 'app/Sponsor/Sponsors.html',
                    controller: 'SponsorGoldController'
                }
            }
        })
        .state('tab.sponsorSilver', {
            url: '/sponsorSilver',
            views: {
                'more': {
                    templateUrl: 'app/Sponsor/Sponsors.html',
                    controller: 'SponsorSilverController'
                }
            }
        })


        .state('tab.sponsorDescription', {
            url: '/sponsor/:Type/:Id',
            views: {
                'more': {
                    templateUrl: 'app/Sponsor/sponsorDescription.html',
                    controller: 'SponsorDescriptionController'
                }
            }
        })

              .state('tab.homeTinder', {
                  url: '/homeTinder',
                  views: {
                      'more': {
                          templateUrl: 'app/Home/tinderHome.html',
                          controller: 'HomeController'
                      }
                  }
              });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/splash');





});

