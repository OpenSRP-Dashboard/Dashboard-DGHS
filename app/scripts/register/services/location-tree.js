'use strict';

angular.module('opensrpSiteApp')
   .service('LocationTree', function ($q, $http, OPENSRP_WEB_BASE_URL, $rootScope) {      
      
      return{
			location_tree: function($scope){     
			$scope.formData = [];
			 
			var districtAPIURL = OPENSRP_WEB_BASE_URL+"/get-location-by-tag-name?tagName=District";
			var districts =  $http.get(districtAPIURL, { cache: false});
			$q.all([districts]).then(function(results){
				$scope.districtList = results[0].data;
				$scope.formData.district=$scope.districtList[0];
			});
			 
			var thanaAPIURL = OPENSRP_WEB_BASE_URL+"/get-upazillas";
			var thanas =  $http.get(thanaAPIURL, { cache: false});
			$q.all([thanas]).then(function(results){
				$scope.thanaList = results[0].data;				
			});
			  
			$scope.getUnion = function(){				
				
				if($scope.formData.thana==null){
					$scope.wardList = [];
					$scope.unitList = [];
					$scope.healthAssistantList = [];
					$scope.unionList = [];
				}
				if(angular.isObject($scope.formData.thana)){
					console.log($scope.formData.thana);
					$rootScope.loading = true;
					var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.thana.id;
					var unionList = $http.get(unionListURL, { cache: false});
					  $q.all([unionList]).then(function(results){
					  $scope.unionList = results[0].data;
					  $rootScope.loading = false;
					}); 
					$scope.wardList = [];
					$scope.unitList = [];
					$scope.healthAssistantList = [];
				}


			}
			$scope.getWard = function(){ 
				if($scope.formData.union==null){
					$scope.wardList = [];
					$scope.unitList = [];
					$scope.healthAssistantList = [];					
				}
				if(angular.isObject($scope.formData.union)){ 
					$rootScope.loading = true;    
					var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.union.id;
					var wardList = $http.get(wardListURL, { cache: false});
					$q.all([wardList]).then(function(results){
						$scope.wardList = results[0].data;
						$rootScope.loading = false;
					}); 
					$scope.unitList = []; 
					$scope.healthAssistantList = [];  
				  } 
			}

			$scope.getUnit = function(){ 
				if($scope.formData.ward==null){
					$scope.unitList = [];					
					$scope.healthAssistantList = [];					
				}
				if(angular.isObject($scope.formData.ward)){
					$rootScope.loading = true;     
					var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.ward.id;
					var units = $http.get(wardListURL, { cache: false});
					$q.all([units]).then(function(results){
						$scope.unitList = results[0].data;
						$rootScope.loading = false;
					});
					$scope.healthAssistantList = [];
				}
			}

			$scope.getHealthAssistant = function(){ 
				if($scope.formData.unit==null){									
					$scope.healthAssistantList = [];					
				} 
				if(angular.isObject($scope.formData.unit)){ 
					$rootScope.loading = true;   
					var assistantListListURL = OPENSRP_WEB_BASE_URL+"/get-data-senders-by-location?locationId="+$scope.formData.unit.id;
					var assistants = $http.get(assistantListListURL, { cache: false});
					$q.all([assistants]).then(function(results){
						$scope.healthAssistantList = results[0].data;
						$rootScope.loading = false;
					});
				}
			}

			
		  
		}
	}
      
        
});
