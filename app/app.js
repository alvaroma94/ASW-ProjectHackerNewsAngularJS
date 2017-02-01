'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'myApp.submit',
        'myApp.submissions',
    'myApp.submissionsUser',
        'myApp.comment',
        'myApp.submission',
        'myApp.ask',
        'myApp.version',
        'myApp.user',
        'myApp.commentsUser',
        'facebook',
        'angular-storage',
        'angularMoment'
    ])
    .constant('API_URL', 'http://guarded-hamlet-76765.herokuapp.com/api/')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])

    .config(function(FacebookProvider) {
        // Set your appId through the setAppId method or
        // use the shortcut in the initialize method directly.
        FacebookProvider.init('772269536240956');
    })

    .controller('authenticationCtrl', function($scope, Facebook, $http, $window, store, API_URL) {
        $scope.facebookIsReady = false;

        if(store.get('userData')){
            $scope.user = store.get('userData').user.uid;
            $scope.mail = store.get('userData').user.email;
        }
        $scope.login = function () {
            Facebook.login(function(response) {
                Facebook.api('/me?fields=email', function(response) {
                    $http({
                        url: API_URL + "users/facebook/"+response.id,
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).success(function(data) {
                        console.log("logged in");
                        store.set('userData', {'user': {id:data.apiKey, email:response.email, uid: data.id}});
                        console.log(data.id);
                        console.log(data);

                    }).error(function(data){

                        $http({
                            url: API_URL + "users/facebook",
                            dataType: 'json',
                            method: 'POST',
                            data : {
                                username: response.id,
                                password : '12345678',
                                email: response.email,
                                about: ''},
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).success(function(data) {
                            $scope.data = data;
                            store.set('userData', {'user': {id:data.apiKey, email:response.email, uid: data.id}});
                            console.log('success');
                        }).error(function(error) {
                            console.log(error);
                        });
                    });
                })
            });
        };
        $scope.removeAuth = function () {
            store.remove('userData');
            $window.location.reload();
        };

        $scope.isLogged = function () {
            if(store.get('userData') != null)
                return true;
            return false;
        };

        $scope.$watch(function() {
                return Facebook.isReady();
            }, function(newVal) {
                if (newVal) {
                    $scope.facebookIsReady = true;
                }
            }
        );
    });