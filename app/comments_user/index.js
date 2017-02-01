'use strict';

angular.module('myApp.commentsUser', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/comments/user/:id', {
            templateUrl: 'comments_user/index.html',
            controller: 'CommentsUserCtrl'
        });
    }])

    .controller('CommentsUserCtrl', function($http, $scope,$routeParams, API_URL) {

        $scope.comments = "";
        $scope.replies = "";


        $scope.user = "";
            $http.get(API_URL +'users/'+$routeParams.id).
            success(function(data) {
                $scope.user = data.email;

            }).error(function() {
                console.log("Error on retrieving user")
            });

        $http.get(API_URL +'comments/user/'+$routeParams.id).
        success(function(data) {
            $scope.comments = data;

        }).error(function() {
            console.log("Error on retrieving comments")
        });



        $http.get(API_URL +'replies/user/'+$routeParams.id).
        success(function(data) {
            $scope.replies = data;

        }).error(function() {
            console.log("Error on retrieving replies")
        });


    });