'use strict';

angular.module('myApp.submissions', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'submissions/index.html',
            controller: 'SubmissionsCtrl'
        });
    }])

    .controller('SubmissionsCtrl', function($http, store, $scope,API_URL, $window) {

        $scope.data = "";
        $scope.users = [];
        $http.get(API_URL + 'submissions').
        success(function(data) {
            $scope.data = data;
            angular.forEach(data, function(value, key) {
                $http.get('http://guarded-hamlet-76765.herokuapp.com/api/users/'+value.author_id).
                success(function(user) {
                    $scope.users[value.id] = user.email;
                });
            });


        },function() {
            console.log("Error on retrieving sumbissions");
        });

        $scope.voteSubmission = function(id) {

            $scope.user = store.get('userData').user;
            if($scope.user) {
                $http({
                    url: API_URL + 'submissions/' + id + '/vote',
                    dataType: 'json',
                    method: 'PUT',
                    data: {
                        apiKey: $scope.user.id,
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data) {
                    $window.location.reload();
                    console.log("success voting " + id + " submission");
                }).error(function (error) {
                    console.log("error");
                    console.log(error);
                });
            }
            else{
                $window.location.href = '#/';
            }

        };



    });