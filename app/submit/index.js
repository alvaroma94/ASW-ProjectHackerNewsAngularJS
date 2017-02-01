'use strict';

angular.module('myApp.submit', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/submit/', {
            templateUrl: 'submit/index.html',
            controller: 'SubmitCtrl'
        });
    }])

    .controller('SubmitCtrl', function($http, $scope, $rootScope, $window,API_URL, store) {

        $scope.title = "";
        $scope.url = "";
        $scope.content = "";
        $scope.errorMessage = "";

        function ValidURL(str) {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex .test(str)) {
                return false;
            } else {
                return true;
            }
        }

        $scope.submit = function(){
            if($scope.url){
                if(!ValidURL($scope.url)){
                    $scope.errorMessage = "this url is not a valid one";
                }
                else $scope.errorMessage = "";
            }
            else $scope.errorMessage = "";
            $scope.user = store.get('userData');
            if($scope.user) {
                $http({
                    url: API_URL +"submissions/",
                    dataType: 'json',
                    method: 'POST',
                    data: {
                        title: $scope.title,

                url: $scope.url,
                        content: $scope.content,
                        apiKey: $scope.user.user.id,
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).success(function (data) {
                    $window.location.href = '#/submissions/'+data.id;
                }).error(function (error) {
                    console.log(error);
                });
            }
            else{
                $window.location.href = '#/';

            }
        }
    });