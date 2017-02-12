'use strict';

angular.module('opensrpSiteApp')
   .controller('MemberController', function ($scope,$rootScope,$cookies, $routeParams,$q,$location, $http, $window,$timeout,OPENSRP_WEB_BASE_URL,AclService, HouseholdService,LocationTree,CommonService) {
        
    $scope.can = AclService.can; 
    LocationTree.location_tree($scope);
    var url = $location.path().split("/")[2];
    $scope.type = $routeParams.type ;
    $scope.memberType ="";
    if($scope.type =='women'){
    	$scope.memberType = "&Is_woman=1";
    	$scope.memberName="Women Name";
    	$scope.guardian1="Husband";
    	$scope.guardian2="Woman Information";    	
    }else if($scope.type =='child'){
    	$scope.memberType = "&Is_child=1";
    	$scope.memberName="Child Name";
    	$scope.guardian1=" Child Mother";
    	$scope.guardian2="Child Father";    	
    }else{

    }  
   
    // default data based on user type
    // if user type is Admin then all data are showing
    // if user type is HI then data showing only within his/her area which is thana based
    // if user type is AHI then data showing only within his/her area which is Union based
    // if user is HA then only his/her data are showing.
    if(url =='list'){
        $rootScope.loading = true;
		CommonService.userRoleCondition($scope,$cookies);
		var defaultApiURL = OPENSRP_WEB_BASE_URL+"/get-member-count-by-keys?type=Members"+$scope.memberType+$scope.userCondition;
		var deferred = $q.defer();
		var memberDateCount = $http.get(defaultApiURL, { cache: false}); 
		$scope.pageno = 1; // initialize page no to 1         
		$scope.itemsPerPage = 10; //this could be a dynamic value from a drop down    
		$scope.data = []; 
		$q.all([memberDateCount]).then(function(results){
		    $scope.count = results[0].data ;
		    $scope.defautData=function(pageno){       
		    var p = (pageno*$scope.itemsPerPage)-$scope.itemsPerPage;
		    var defaultApiURL = OPENSRP_WEB_BASE_URL+"/member-search?type=Members"+$scope.memberType+$scope.userCondition+"&p="+p+"&limit="+$scope.itemsPerPage;
		    var deferred = $q.defer();
		    var memberDataList = $http.get(defaultApiURL, { cache: false}); 
		        $q.all([memberDataList]).then(function(results){ 
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
        	var memberDetailsApiURL = OPENSRP_WEB_BASE_URL+"/get-member-details?id="+$routeParams.id;
			var deferred = $q.defer();
			var memberDetails = $http.get(memberDetailsApiURL, { cache: false}); 
        	$q.all([memberDetails]).then(function(results){
        		$scope.data = results[0].data;
        		$scope.BNFVisit = $scope.data["BNFVisit"];
        		$scope.TTVisit = $scope.data["TTVisit"];
        		$scope.generalVisit = $scope.data["generalVisit"];
        		$scope.child_vaccine = $scope.data["child_vaccine"];
        		$scope.details = $scope.data["details"];
        		delete $scope.data["BNFVisit"];
        		delete $scope.data["TTVisit"];
        		delete $scope.data["generalVisit"];
        		delete $scope.data["child_vaccine"];
        		delete $scope.data["details"];
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
			var type = "type=Members"; 			
			if(!angular.isObject($scope.formData.thana)){
				thana ="";
			}else{				
				thana = "&Member_UPAZILLA="+'"'+$scope.formData.thana.name+'"';			
			}
			if(!angular.isObject($scope.formData.union)){
				union = "";
			}else{			
				union = "&Member_UNION="+'"'+$scope.formData.union.name+'"';
			}
			if(!angular.isObject($scope.formData.ward)){
				ward = "";
			}else{			  
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
			if($scope.formData.Member_Fname =="" || $scope.formData.Member_Fname==null){
				
				HouseholdName ="";
			}else{				
				HouseholdName = "&Member_Fname="+'"'+$scope.formData.Member_Fname+'"';			
			} 
			//only for unit or block label user
			if($cookies.get('roleName') =="HA"){
				health_assistant = "&PROVIDERID="+'"'+$rootScope.username+'"';
			}else{}
			var memberSearchCountApiURL = OPENSRP_WEB_BASE_URL+"/get-member-count-by-keys?"+type+$scope.memberType+thana+union+ward+unit+health_assistant+HouseholdName;
			var deferred = $q.defer();
			var memberSearchDataCount = $http.get(memberSearchCountApiURL, { cache: false}); 
			$scope.pageno = 1; // initialize page no to 1         
			$scope.itemsPerPage = 10; //this could be a dynamic value from a drop down    
			$scope.data = []; 
			$q.all([memberSearchDataCount]).then(function(results){
			    $scope.count = results[0].data ;
			    $scope.searchData=function(pageno){       
			    var p = (pageno*$scope.itemsPerPage)-$scope.itemsPerPage;
			    var memberSearchApiURL = OPENSRP_WEB_BASE_URL+"/member-search?"+type+$scope.memberType+thana+union+ward+unit+health_assistant+HouseholdName+"&p="+p+"&limit="+$scope.itemsPerPage;
			    var deferred = $q.defer();
			    var memberSerchDataList = $http.get(memberSearchApiURL, { cache: false}); 
			        $q.all([memberSerchDataList]).then(function(results){ 
			           $scope.data = results[0].data.vaccineEntries;
			           $scope.total_count =  $scope.count;
			           $rootScope.loading = false;	 
			        });
			    }
			    $scope.searchData($scope.pageno);
			});

		}
		
		
    
    });
