'use strict';

angular.module('opensrpSiteApp')
   .controller('HouseholdController', function ($scope,$rootScope,$cookies, $routeParams,$q,$location, $http, $window,$timeout,OPENSRP_WEB_BASE_URL,AclService, HouseholdService) {
        
      $scope.can = AclService.can; 
      $scope.formData = [];
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
		  var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.union.id;
		  var wardList = $http.get(wardListURL, { cache: false});
		  $q.all([wardList]).then(function(results){
			$scope.wardList = results[0].data;
		  }); 
		  $scope.unitList = []; 
		  $scope.healthAssistantList = [];   
		}

		$scope.getUnit = function(){      
		  var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.ward.id;
		  var units = $http.get(wardListURL, { cache: false});
		  $q.all([units]).then(function(results){
			$scope.unitList = results[0].data;
		  });
		   $scope.healthAssistantList = [];
		}

		$scope.getHealthAssistant = function(){      
		  var assistantListListURL = OPENSRP_WEB_BASE_URL+"/get-data-senders-by-location?locationId="+$scope.formData.unit.id;
		  var assistants = $http.get(assistantListListURL, { cache: false});
		  $q.all([assistants]).then(function(results){
			$scope.healthAssistantList = results[0].data;
			$scope.healthAssistantList =results[0].data;
		  });
		}
           
      $scope.search = function(){
		  $scope.dataShowHide = false;
		  var thana;
		  var union;
		  var unit;
		  var ward;
		  var health_assistant;
		  if($scope.formData.thana =='undefined'){
			thana ="";
		  }else{
			var  type = "type=Household";
			thana = "&UPAZILLA="+'"'+$scope.formData.thana.name+'"';			
		  }
		  if(!angular.isObject($scope.formData.union)){
			union = "";
		  }else{
			console.log(444);
			union = "&UNION="+'"'+$scope.formData.union.name+'"';
		  }
		  if(!angular.isObject($scope.formData.ward)){
			ward = "";
		  }else{
			  console.log(333)
			ward = "&WARD="+'"'+$scope.formData.ward.name+'"';
		  }
		  if(!angular.isObject($scope.formData.unit)){
			unit = "";
		  }else{
			unit = "&BLOCK="+'"'+$scope.formData.unit.name+'"';
		  }
		  if(!angular.isObject($scope.formData.health_assistant)){
			health_assistant = "";
		  }else{
			health_assistant = "&PROVIDERID="+'"'+$scope.formData.health_assistant.user_name+'"';
		  }
		  
		  var householsAPIURL = OPENSRP_WEB_BASE_URL+"/households/search?"+type+thana+union+ward+unit+health_assistant;
		  console.log(householsAPIURL);
		  var deferred = $q.defer();
		  var householdData = $http.get(householsAPIURL, { cache: false});               
		  // search data
		  $q.all([householdData]).then(function(results){ 
			        
			$scope.data = results[0].data.hhRegisterEntries;
			if($scope.data.length ==0){
			 $scope.dataShowHide = false;
			 $scope.emptyDataShowHide= true;
		  }else{
			$scope.dataShowHide = true;
			$scope.emptyDataShowHide= false;
		  }        
			HouseholdService.data($scope,$scope.data); 
		  });
		}
		
		var householsAPIURL = OPENSRP_WEB_BASE_URL+"/households/search?type=Household"+"&PROVIDERID="+$rootScope.username;
		var deferred = $q.defer();
		var allHousehold = $http.get(householsAPIURL, { cache: false});               
		$scope.userRoleName = true;
		if($cookies.get('userRoleName') == 'false'){
			$scope.userRoleName = false;			
			$q.all([allHousehold]).then(function(results){           
			  $scope.data = results[0].data.hhRegisterEntries;
			  if($scope.data.length ==0){
				 $scope.dataShowHide = false;
				 $scope.emptyDataShowHide= true;
			  }else{
				$scope.dataShowHide = true;
				$scope.emptyDataShowHide= false;
			  }
			 
			  HouseholdService.data($scope,$scope.data); 
			});  
		
		}
		
    
    });
