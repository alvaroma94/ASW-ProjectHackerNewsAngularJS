'use strict';

angular.module('myApp.user', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/users/:id', {
            templateUrl: 'user/index.html',
            controller: 'UserCtrl'
        });
    }])

    .controller('UserCtrl', function($http, $scope,$routeParams, store,API_URL, $window) {

        $scope.data = "";
        $scope.comments = [];
        $scope.editable = false;
        $scope.about = "";
        $scope.user = store.get('userData').user.uid;
        if($scope.user){
            if($scope.user == $routeParams.id){
                $scope.editable = true;
            }
        }
        console.log($scope.user);
        $http.get(API_URL + 'users/'+$routeParams.id).
        success(function(data) {
            $scope.data = data;
            $scope.about = data.about;
            console.log(data.about);
        },function() {
            console.log("Error on retrieving user")
        });


        $scope.submit = function(){
                $http({
                    url: API_URL + 'users/' + $routeParams.id,
                    dataType: 'json',
                    method: 'PUT',
                    data: {
                        apiKey: store.get('userData').user.id,
                        about: $scope.about,
                        id: $routeParams.id
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data) {
                    console.log($scope.about);
                    console.log($scope.data);
                    $window.location.reload();
                }).error(function (error) {
                    console.log("error");
                    console.log(error);
                });
            }

    });