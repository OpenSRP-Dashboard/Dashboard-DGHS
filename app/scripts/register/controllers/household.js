'use strict';

angular.module('opensrpSiteApp')
   .controller('HouseholdController', function ($scope,$rootScope,$cookies, $routeParams,$q,$location, $http, $window,$timeout,OPENSRP_WEB_BASE_URL,AclService, HouseholdService,LocationTree,CommonService) {
        
        $scope.can = AclService.can; 
     	LocationTree.location_tree($scope);
        var url = $location.path().split("/")[2]; 
        
        // default data based on user type
        // if user type is Admin then all data are showing
        // if user type is HI then data showing only within his/her area which is thana based
        // if user type is AHI then data showing only within his/her area which is Union based
        // if user is HA then only his/her data are showing.
        if(url =='list'){
        	$rootScope.loading = true;	        
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
		           $rootScope.loading = false;
		        });
		      }
		      $scope.defautData($scope.pageno);
		    });

        }else if(url =='search'){
        	CommonService.userCondition($scope,$cookies);       	

        }else if(url =='details'){
        	var householdDetailsApiURL = OPENSRP_WEB_BASE_URL+"/get-household-details?id="+$routeParams.id;
			var deferred = $q.defer();
			var householdDetails = $http.get(householdDetailsApiURL, { cache: false}); 
        	$q.all([householdDetails]).then(function(results){
        		$scope.data = results[0].data;
        		
        		$scope.MEMBERDETAILS = $scope.data["MEMBERDETAILS"];
        		delete $scope.data["MEMBERDETAILS"];
        		$scope.details = $scope.data["details"];
        		delete $scope.data["details"];
        		$scope.multimediaAttachments = $scope.data["multimediaAttachments"];
        		delete $scope.data["multimediaAttachments"];
        		delete $scope.data["revision"];
        		delete $scope.data["type"];

        	});

        }else{

        }

        $scope.search = function(){
        	$rootScope.loading = true;	
			$scope.dataShowHide = false;
			var thana;
			var union;
			var unit;
			var ward;
			var health_assistant;
			var HouseholdName;
			var type = "type=HouseHold"; 			
			if(!angular.isObject($scope.formData.thana)){
				thana ="";
			}else{				
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
			if($scope.formData.HoH_Fname =="" || $scope.formData.HoH_Fname==null){
				console.log($scope.formData.HoH_Fname);
				HouseholdName ="";
			}else{				
				HouseholdName = "&HoH_Fname="+'"'+$scope.formData.HoH_Fname+'"';			
			} 
			//only for unit or block label user
			if($cookies.get('roleName') =="HA"){
				health_assistant = "&PROVIDERID="+'"'+$rootScope.username+'"';
			}else{}
			var householdSearchCountApiURL = OPENSRP_WEB_BASE_URL+"/get-household-count-by-keys?"+type+thana+union+ward+unit+health_assistant+HouseholdName;
			var deferred = $q.defer();
			var householdSearchDataCount = $http.get(householdSearchCountApiURL, { cache: false}); 
			$scope.pageno = 1; // initialize page no to 1         
			$scope.itemsPerPage = 10; //this could be a dynamic value from a drop down    
			$scope.data = []; 
			$q.all([householdSearchDataCount]).then(function(results){
			    $scope.count = results[0].data ;
			    $scope.searchData=function(pageno){       
			    var p = (pageno*$scope.itemsPerPage)-$scope.itemsPerPage;
			    var householdSearchApiURL = OPENSRP_WEB_BASE_URL+"/household-search?"+type+thana+union+ward+unit+health_assistant+HouseholdName+"&p="+p+"&limit="+$scope.itemsPerPage;
			    var deferred = $q.defer();
			    var householdSerchDataList = $http.get(householdSearchApiURL, { cache: false}); 
			        $q.all([householdSerchDataList]).then(function(results){ 
			           $scope.data = results[0].data.vaccineEntries;
			           $scope.total_count =  $scope.count;
			           $rootScope.loading = false;	 
			        });
			    }
			    $scope.searchData($scope.pageno);
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
