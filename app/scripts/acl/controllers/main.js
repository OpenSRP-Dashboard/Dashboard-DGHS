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
	   
	   var getRoleUrl = OPENSRP_WEB_BASE_URL+"/get-role-by-userName?userName="+$rootScope.username;
	   var getUserUrl = OPENSRP_WEB_BASE_URL+"/get-user-by-name?userName="+$rootScope.username;
	   var roles = $http.get(getRoleUrl, { cache: true});	
	   var userInfo = $http.get(getUserUrl, { cache: true});	
		$q.all([roles,userInfo]).then(function(results){
			$rootScope.roles = results[0].data;
			console.log(results[1].data);			
			$cookies.put('userRoleName', true);	
			$cookies.put('locationId', results[1].data.location[0].id);	
			$cookies.put('roleName', results[1].data.roles[0].name);			
			for(var i=0;i<$rootScope.roles.length;i++){									
				if($rootScope.roles[i].name == 'FWA'){	
					console.log(i)								
					$cookies.put('userRoleName', false); 
					break;
				}
			}
		});
    
  });
