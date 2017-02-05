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
	   
	   //var getRoleUrl = OPENSRP_WEB_BASE_URL+"/get-role-by-userName?userName="+$rootScope.username;
	   var getUserUrl = OPENSRP_WEB_BASE_URL+"/get-user-by-name?userName="+$rootScope.username;
	   //var roles = $http.get(getRoleUrl, { cache: true});	
	   var userInfo = $http.get(getUserUrl, { cache: true});	
		$q.all([userInfo]).then(function(results){
			$rootScope.users = results[0].data;
					
			$cookies.put('userRoleName', true);	
			$cookies.put('locationId', $rootScope.users.location[0].id);	
			$cookies.put('roleName', $rootScope.users.roles[0].name);
						
			for(var i=0;i<results[0].data.roles.length;i++){									
				if($rootScope.users.roles[i].name == 'FWA'){
					console.log($rootScope.users.roles[i].name);
					$cookies.put('userRoleName', false); 
					break;
				}
			}
		});
    
  });
