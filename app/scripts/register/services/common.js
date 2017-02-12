'use strict';

angular.module('opensrpSiteApp')
   .service('CommonService', function ($q, $http, OPENSRP_WEB_BASE_URL, $rootScope) {      
      
      return{
      		userRoleCondition: function($scope,$cookies){
      			$scope.userCondition = "";
      			if($cookies.get('roleName') =="Admin"){
					$scope.userCondition = "";
				}else if($cookies.get('roleName') =="HI"){
					$scope.userCondition = "&Member_UPAZILLA="+$cookies.get('locationName');
				}else if($cookies.get('roleName') =="AHI"){
					$scope.userCondition = "&Member_UNION="+$cookies.get('locationName');
				}else if($cookies.get('roleName') =="HA"){
					$scope.userCondition = "&PROVIDERID="+$rootScope.username;
				}else{

				}
      		},
			userCondition: function($scope,$cookies){
				if($cookies.get('roleName') =="Admin"){	
	        		$scope.thanaShowHide = true;			
					$scope.unionShowHide = true;
					$scope.wardShowHide = true;
		        	$scope.unitShowHide = true;
		        	$scope.HAShowHide = true;
		        	$scope.nameShowHide = true;
				}else if($cookies.get('roleName') =="HI"){
					getUnionListByThanaId($cookies.get('locationId'));
					$scope.unionShowHide = true;
					$scope.wardShowHide = true;
		        	$scope.unitShowHide = true;
		        	$scope.HAShowHide = true;
		        	$scope.nameShowHide = true;
				}else if($cookies.get('roleName') =="AHI"){				
					$scope.wardShowHide = true;
		        	$scope.unitShowHide = true;
		        	$scope.HAShowHide = true;
		        	$scope.nameShowHide = true;				
					getWordListByUnionId($cookies.get('locationId'));
				}else if($cookies.get('roleName') =="HA"){
					$scope.nameShowHide = true;
				}else{
					$scope.thanaShowHide = false;			
					$scope.unionShowHide = false;
					$scope.wardShowHide = false;
		        	$scope.unitShowHide = false;
		        	$scope.HAShowHide = false;
		        	$scope.nameShowHide = false;
				}      
			
		  },
		  getUnionListByThanaId: function(thanaId){
		  	var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+thanaId;
			var unions = $http.get(unionListURL, { cache: false});
			$q.all([unions]).then(function(results){
				$scope.unionList = results[0].data;
			});	

		  },
		  getWordListByUnionId: function(unionId){
		  	var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+unionId;
			var wards = $http.get(wardListURL, { cache: false});
			$q.all([wards]).then(function(results){
				$scope.wardList = results[0].data;
			});	
		  },
	  }
      
        
    });
