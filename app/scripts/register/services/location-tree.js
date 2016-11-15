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
				$scope.formData.thana=$scope.thanaList[0];
			  });
			  
			  $scope.getUnion = function(){
				  if(angular.isObject($scope.formData.thana)){
					var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.thana.id;
					var unionList = $http.get(unionListURL, { cache: false});
					  $q.all([unionList]).then(function(results){
					  $scope.unionList = results[0].data;
					}); 
					$scope.wardList = [];
					$scope.unitList = [];
					$scope.healthAssistantList = [];
				 }
				}
				$scope.getWard = function(){ 
				if(angular.isObject($scope.formData.union)){     
				  var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.union.id;
				  var wardList = $http.get(wardListURL, { cache: false});
				  $q.all([wardList]).then(function(results){
					$scope.wardList = results[0].data;
				  }); 
				  $scope.unitList = []; 
				  $scope.healthAssistantList = [];  
				  } 
				}

				$scope.getUnit = function(){ 
				if(angular.isObject($scope.formData.ward)){     
				  var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.ward.id;
				  var units = $http.get(wardListURL, { cache: false});
				  $q.all([units]).then(function(results){
					$scope.unitList = results[0].data;
				  });
				   $scope.healthAssistantList = [];
				}
				}

				$scope.getHealthAssistant = function(){  
				if(angular.isObject($scope.formData.unit)){    
				  var assistantListListURL = OPENSRP_WEB_BASE_URL+"/get-data-senders-by-location?locationId="+$scope.formData.unit.id;
				  var assistants = $http.get(assistantListListURL, { cache: false});
				  $q.all([assistants]).then(function(results){
					$scope.healthAssistantList = results[0].data;
					$scope.healthAssistantList =results[0].data;
				  });
				}
				}
		  
		  }
	  }
      
        
    });
