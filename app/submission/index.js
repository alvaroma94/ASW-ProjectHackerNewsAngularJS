'use strict';

angular.module('myApp.submission', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/submissions/:id', {
            templateUrl: 'submission/index.html',
            controller: 'SubmissionCtrl'
        });
    }])

    .controller('SubmissionCtrl', function($http, $scope, store, $routeParams,API_URL, $window) {

        //$scope.data = "";
        $scope.comments = [];
        $scope.content = "";

        $scope.commentUsers = [];
        $scope.replyUsers = [];

        $scope.replies = [];

        $scope.addcomment = function() {
            if ($scope.content) {
                $scope.user = store.get('userData').user;
                if($scope.user) {
                    $http({
                        url: API_URL+'submissions/'+$routeParams.id,
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
                        //$window.location.href = '#/submissions/'+$routeParams.id;
                    }).error(function (error) {
                        console.log(error);
                    });
                }
                else{
                    $window.location.href = '#/';
                }
            }
        };

        $http.get(API_URL +'submissions/'+$routeParams.id).
        success(function(data) {
            $scope.data = data;

            $http.get(API_URL +'users/'+data.author_id).
            success(function(data) {
                $scope.author = data.email;
            });


            angular.forEach(data.comments, function(value, key) {
                $http.get(API_URL + 'comments/'+value.id).
                success(function(comment) {
                    var auxReplies = [];
                    $scope.comments.push(comment);

                    $http.get('http://guarded-hamlet-76765.herokuapp.com/api/users/'+comment.author_id).
                    success(function(user) {
                        $scope.commentUsers[value.id] = user.email;
                    });

                    angular.forEach(comment.replies, function(value, key) {
                        $http.get('http://guarded-hamlet-76765.herokuapp.com/api/replies/'+value.id).
                        success(function(reply) {
                            auxReplies.push(reply);

                            $http.get('http://guarded-hamlet-76765.herokuapp.com/api/users/'+reply.author_id).
                            success(function(user) {
                                $scope.replyUsers[value.id] = user.email;
                            });
                        });
                    });

                    $scope.replies[comment.id] = auxReplies;
                });
            });
        },function() {
            console.log("Error on retrieving sumbission");
        });


        $scope.getAuthor = function(id) {
            $http.get(API_URL + 'users/'+id).
            success(function(user) {
                $scope.user = user;

                console.log("user:" + user)
            });

        };

        $scope.voteSubmission = function(id) {

            $scope.user = store.get('userData').user;
            if($scope.user) {
                $http({
                    url: API_URL + 'submissions/' + id + '/vote',
                    dataType: 'json',
                    method: 'PUT',
                    data: {
                        apiKey: $scope.user.id
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