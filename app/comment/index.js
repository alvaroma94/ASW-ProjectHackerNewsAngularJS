'use strict';

angular.module('myApp.comment', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/comments/:id', {
            templateUrl: 'comment/index.html',
            controller: 'CommentCtrl'
        });
    }])

    .controller('CommentCtrl', function($http, $scope, $routeParams, store, API_URL, $rootScope, $window) {

        $scope.replies = [];
        $scope.content = "";
        $scope.replyUsers = [];

        $scope.addreply = function() {
            if ($scope.content) {
                $scope.user = store.get('userData').user;
                if($scope.user) {
                    $http({
                        url: API_URL+'comments/'+$routeParams.id,
                        dataType: 'json',
                        method: 'POST',
                        data: {
                            content: $scope.content,
                            apiKey: $scope.user.id,
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).success(function (data) {
                        $window.location.reload();
                        //$window.location.href = '#/comments/'+$routeParams.id;
                    }).error(function (error) {
                        console.log(error);
                    });
                }
                else{
                    $window.location.href = '#/';
                }
            }
        }

        $http.get('http://guarded-hamlet-76765.herokuapp.com/api/comments/'+$routeParams.id).
        success(function(data) {
            $scope.data = data;

            $http.get(API_URL +'users/'+ data.author_id).
            success(function(data) {
                $scope.author = data.email;
            });

            angular.forEach(data.replies, function(value, key) {
                $http.get('http://guarded-hamlet-76765.herokuapp.com/api/replies/'+value.id).
                success(function(reply) {
                    $scope.replies.push(reply);

                    $http.get('http://guarded-hamlet-76765.herokuapp.com/api/users/'+reply.author_id).
                    success(function(user) {
                        $scope.replyUsers[value.id] = user.email;
                    });

                });
            });
        },function() {
            console.log("Error on retrieving comment");
        });

        $scope.voteComment = function(id) {

            $scope.user = store.get('userData').user;
            if($scope.user) {
                $http({
                    url: API_URL + 'comments/' + id + '/vote',
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

        $scope.voteReply = function(id) {

            $scope.user = store.get('userData').user;
            if($scope.user) {
                $http({
                    url: API_URL + 'replies/' + id + '/vote',
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