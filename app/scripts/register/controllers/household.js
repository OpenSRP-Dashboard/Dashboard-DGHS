'use strict';

angular.module('opensrpSiteApp')
   .controller('HouseholdController', function ($scope,$rootScope,$cookies, $routeParams,$q,$location, $http, $window,$timeout,OPENSRP_WEB_BASE_URL,AclService, HouseholdService,LocationTree,DataService) {
        
        $scope.can = AclService.can; 
     	
        var url = $location.path().split("/")[2]; 
        
        if(url =='list'){
	        /*var householsAPIURL = OPENSRP_WEB_BASE_URL+"/households/search?type=Household"+"&PROVIDERID="+$rootScope.username;
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
		
			}*/
			var userCondition = "";
			if($cookies.get('roleName') =="Admin"){
				userCondition = "";
			}else if($cookies.get('roleName') =="HI"){
				userCondition = "&UPAZILLA="+$cookies.get('locationName');
			}else if($cookies.get('roleName') =="AHI"){
				userCondition = "&UNION="+$cookies.get('locationName');
			}else if($cookies.get('roleName') =="HA"){
				userCondition = "&PROVIDERID="+$rootScope.username;
			}else{

			}
		    var defaultApiURL = OPENSRP_WEB_BASE_URL+"/get-household-count-by-keys?type=HouseHold"+userCondition;
		    var deferred = $q.defer();
		    var campDateCount = $http.get(defaultApiURL, { cache: false}); 
		    $scope.pageno = 1; // initialize page no to 1         
		    $scope.itemsPerPage = 10; //this could be a dynamic value from a drop down    
		    $scope.data = []; 
		    $q.all([campDateCount]).then(function(results){
		        $scope.count = results[0].data ;
		        $scope.defautData=function(pageno){       
		        var p = (pageno*$scope.itemsPerPage)-$scope.itemsPerPage;
		        var defaultApiURL = OPENSRP_WEB_BASE_URL+"/household-search?type=HouseHold"+userCondition+"&p="+p+"&limit="+$scope.itemsPerPage;
		        var deferred = $q.defer();
		        var campDateList = $http.get(defaultApiURL, { cache: false}); 
		        $q.all([campDateList]).then(function(results){ 
		           $scope.data = results[0].data.vaccineEntries;
		           $scope.total_count =  $scope.count; 
		        });
		      }
		      $scope.defautData($scope.pageno);
		    });

        }else if(url =='search'){
        	
        	if($cookies.get('roleName') =="Admin"){
				LocationTree.location_tree($scope);
			}else if($cookies.get('roleName') =="HI"){
				getUnionListByThanaId($cookies.get('locationId'));
			}else if($cookies.get('roleName') =="AHI"){
				console.log($cookies.get('roleName'));
				getWordListByUnionId($cookies.get('locationId'));
			}else if($cookies.get('roleName') =="HA"){
				
			}else{

			}
        	

        }else{
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
			union = "&UNION="+'"'+$scope.formData.union.name+'"';
		  }
		  if(!angular.isObject($scope.formData.ward)){
			ward = "";
		  }else{			  
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
			DataService.data($scope,$scope.data); 
		  });
		}
		
		
		function getUnionListByThanaId(thanaId){				
			var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+thanaId;
			var unions = $http.get(unionListURL, { cache: false});
			$q.all([unions]).then(function(results){
				$scope.unionList = results[0].data;
			});				
		}
		function getWordListByUnionId(unionId){				
			var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+unionId;
			var wards = $http.get(wardListURL, { cache: false});
			$q.all([wards]).then(function(results){
				$scope.wardList = results[0].data;
			});				
		}
    
    });
