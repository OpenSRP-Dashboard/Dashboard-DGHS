'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:AuthControllerCtrl
 * @description
 * # AuthControllerCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
   .controller('LoginCtrl', function ($scope,$rootScope, $location,$q, $http, $window,$timeout,OPENSRP_WEB_BASE_URL, Authentication, Login,Common) {
       $scope.loading = false;

        $scope.loginUser = function () {
            $scope.loading = true;
            Login.login($scope.username, $scope.password).then(function (result) {		           
                if (result === true) {  
					
		            
                    Authentication.authenticate($scope.username, $scope.password);
                    Common.acl($timeout,$rootScope,$http,$scope.username,$window,Authentication,$location,$scope); 
                   // Common.bypassAcl($scope, $window);
                    //$window.location = '#/';
                    if (!$scope.$$phase) {
                        //this will kickstart angular to notice the change
                        $scope.$apply();
                    }
                } 
                else{
                    alert('Authentication failed for user: ' + $scope.username);
                    $scope.loading = false;
                    //$window.location = '#/';
                }
            });
        };
    })
    .controller('LogoutCtrl', function ($scope, $location, $http, $window, Authentication) {
        

        Authentication.clearCredentials();
        $location.path('#/');
        if (!$scope.$$phase) {
            //this will kickstart angular to notice the change
            $scope.$apply();
        }
        else {
            $window.location = '#/';
        }
    });
