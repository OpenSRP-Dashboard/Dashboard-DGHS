'use strict';

angular.module('opensrpSiteApp')
   .controller('ChildController', function ($scope,$rootScope,$cookies, $routeParams,$q,$location, $http, $window,$timeout,OPENSRP_WEB_BASE_URL,AclService, HouseholdService,LocationTree,DataService) {
        
      $scope.can = AclService.can; 
     LocationTree.location_tree($scope);
           
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
			var  type = "type=Members&Is_child=1";
			thana = "&Member_UPAZILLA="+'"'+$scope.formData.thana.name+'"';			
		  }
		  if(!angular.isObject($scope.formData.union)){
			union = "";
		  }else{
			console.log(444);
			union = "&Member_UNION="+'"'+$scope.formData.union.name+'"';
		  }
		  if(!angular.isObject($scope.formData.ward)){
			ward = "";
		  }else{
			  console.log(333)
			ward = "&Member_WARD="+'"'+$scope.formData.ward.name+'"';
		  }
		  if(!angular.isObject($scope.formData.unit)){
			unit = "";
		  }else{
			unit = "&Member_BLOCK="+'"'+$scope.formData.unit.name+'"';
		  }
		  if(!angular.isObject($scope.formData.health_assistant)){
			health_assistant = "";
		  }else{
			health_assistant = "&PROVIDERID="+'"'+$scope.formData.health_assistant.user_name+'"';
		  }
		  
		  var householsAPIURL = OPENSRP_WEB_BASE_URL+"/member/search?"+type+thana+union+ward+unit+health_assistant;
		  console.log(householsAPIURL);
		  var deferred = $q.defer();
		  var householdData = $http.get(householsAPIURL, { cache: false});               
		  // search data
		  $q.all([householdData]).then(function(results){ 
			        
			$scope.data = results[0].data.members;
			if($scope.data.length ==0){
			 $scope.dataShowHide = false;
			 $scope.emptyDataShowHide= true;
		  }else{
			$scope.dataShowHide = true;
			$scope.emptyDataShowHide= false;
		  }        
			DataService.data($scope,$scope.data); 
		  });
		}
		
		var householsAPIURL = OPENSRP_WEB_BASE_URL+"/member/search?Is_child=1&type=Members"+"&PROVIDERID="+$rootScope.username;
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
			 
			  DataService.data($scope,$scope.data); 
			});  
		
		}
		
    
    });
