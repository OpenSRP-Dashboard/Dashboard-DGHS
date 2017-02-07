'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
  .controller('MainCtrl', function ($scope,$http,$cookies,$rootScope,$q,$window,Base64,OPENSRP_WEB_BASE_URL,mapboxService,ngDialog,Main,Page,AclService,$timeout) {
	   $scope.can = AclService.can;
	   
	   
	   var getUserUrl = OPENSRP_WEB_BASE_URL+"/get-user-by-name?userName="+$rootScope.username;
	   	
	   var userInfo = $http.get(getUserUrl, { cache: true});	
		$q.all([userInfo]).then(function(results){
			$rootScope.users = results[0].data;
			console.log($rootScope.users.roles[0].name);
			$cookies.put('userRoleName', true);
			$cookies.put('roleName', $rootScope.users.roles[0].name);
			if($rootScope.users.roles[0].name == "Admin"){				
				
			}else if($rootScope.users.roles[0].name == "HA"){
				
			}else{
				$cookies.put('locationId', $rootScope.users.location[0].id);	
				var getLocationUrl = OPENSRP_WEB_BASE_URL+"/get-location-name?id="+$rootScope.users.location[0].id;
				var location = $http.get(getLocationUrl, { cache: true});
				$q.all([location]).then(function(results){				
					$cookies.put('locationName', results[0].data);
				});
			}

		});
    
  });
