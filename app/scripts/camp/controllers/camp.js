'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
 .controller('CampCtrl', function ($scope,$http,$rootScope,$routeParams,$q,$location,Flash,Base64,OPENSRP_WEB_BASE_URL,ngDialog,AclService,$window,Camp) {
  var today = Camp.dateFormatterTodayInYYYYMMDD();
  var first= new Date(today);  
  $scope.formData = [];
  $scope.campDates = [];
  $scope.sessionNameList = [];
  $scope.campDate = [];
  $scope.statusValue = [];
  $scope.show = false;
  var url = $location.path().split("/")[2];  
  $scope.can = AclService.can;  
  $scope.removeBtnShowHide = function(condition){    
	  if(condition == 'true' || condition==""){
		  return true
	  }else{
		  return false;
	 }	
  }
  var thanaAPIURL = OPENSRP_WEB_BASE_URL+"/get-upazillas";
  var thanas =  $http.get(thanaAPIURL, { cache: true});
  $rootScope.loading = true;
  $q.all([thanas]).then(function(results){
    $scope.thanaList = results[0].data;    
    $scope.formData.thana="Please select";
    $rootScope.loading = false;
  });
  
  $scope.getUnion = function(){ 
    $rootScope.loading = true;   
    if(angular.isObject($scope.formData.thana)){
      var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.thana.id;
      var unionList = $http.get(unionListURL, { cache: true});
      $q.all([unionList]).then(function(results){            
        $scope.unionList = results[0].data;
      }); 
      $scope.wardList = [];
      $scope.unitList = [];
      $scope.healthAssistantList = [];
      $rootScope.loading = false;
    }
  }
  $scope.getWard = function(){ 
    $rootScope.loading = true;
    if(angular.isObject($scope.formData.union)){     
      var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.union.id;
      var wardList = $http.get(wardListURL, { cache: true});
      $q.all([wardList]).then(function(results){
        $scope.wardList = results[0].data;
      }); 
      $scope.unitList = []; 
      $scope.healthAssistantList = [];
      $rootScope.loading = false; 
    }  
  }

  $scope.getUnit = function(){
    $rootScope.loading = true; 
    if(angular.isObject($scope.formData.ward)){          
      var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.ward.id;
      var units = $http.get(wardListURL, { cache: false});
      $q.all([units]).then(function(results){
        $scope.unitList = results[0].data;
      });
      $scope.healthAssistantList = [];
      $rootScope.loading = false;
    }
  }

  $scope.getHealthAssistant = function(){
    $rootScope.loading = true;   
    if(angular.isObject($scope.formData.unit)){    
      var assistantListListURL = OPENSRP_WEB_BASE_URL+"/get-data-senders-by-location?locationId="+$scope.formData.unit.id;
      var assistants = $http.get(assistantListListURL, { cache: false});
      $q.all([assistants]).then(function(results){
        $scope.healthAssistantList = results[0].data;
        $rootScope.loading = false;
      });
    }
  }    
    //$scope.healthAssistantList =[{"name":"sohel"},{"name":"asif"},{"name":"numera"}];
  
  $scope.removeCampDate = function(date){     
    for(var i = $scope.campDates.length - 1; i >= 0; i--) {
      if($scope.campDates[i].session_date === date) {
       $scope.campDates.splice(i, 1);
     }
   }
  }
   $scope.addCampDate = function(){
    if ($scope.formData.date == undefined || $scope.formData.date == ''
      || $scope.formData.status == undefined || $scope.formData.status == '' ) {
     $scope.show = true;
    }else{
      $scope.campDates.push({'session_date':$scope.formData.date,'status':$scope.formData.status,'deleted':true});
      $scope.formData.date ="";
      $scope.formData.status ="";
      $scope.show = false;
      $scope.campDateShow = false;
    }
  }
  $scope.statuses = [
    {'name': 'InActive','value':0},
    {'name': 'Active','value':1}

    ];
 $("#session_date").on("change", function() {
        $scope.formData.date = $("#session_date").val();
  });
 // list page 
  if(url =='list'){ 
    $scope.dataShowHide = true;
    
    $scope.search = function(){
      var thana;
      var union;
      var unit;
      var ward;
      var health_assistant;
      var thana_for_count="";
      var union_for_count ="";
      var ward_for_count ="";
      var unit_for_count ="";
      var health_assistant_for_count ="";
      if($scope.formData.thana =='undefined'){
        thana ="";
        thana_for_count= "";
      }else{
        thana = "thana="+$scope.formData.thana.id;
        thana_for_count = $scope.formData.thana.id;
      }
      if(!angular.isObject($scope.formData.union)){
        union = "";
      }else{        
        union = "&union="+$scope.formData.union.id;
        union_for_count = $scope.formData.union.id;
      }
      if(!angular.isObject($scope.formData.ward)){
        ward = "";
      }else{
        ward = "&ward="+$scope.formData.ward.id;
        ward_for_count = $scope.formData.ward.id;
      }
      if(!angular.isObject($scope.formData.unit)){
        unit = "";
      }else{
        unit = "&unit="+$scope.formData.unit.id;
        unit_for_count = $scope.formData.unit.id;
      }
      if(!angular.isObject($scope.formData.health_assistant)){
        health_assistant = "";
      }else{
        health_assistant = "&health_assistant="+$scope.formData.health_assistant.user_name;
        health_assistant_for_count = $scope.formData.health_assistant.user_name;
      }
      $rootScope.loading = true;
      var apiURLs = OPENSRP_WEB_BASE_URL+"/camp/count?thana="+thana_for_count+"&union="+union_for_count
            +"&ward="+ward_for_count+"&unit="+unit_for_count+"&healthAssistant="+health_assistant_for_count;
      var deferred = $q.defer();
      var campDateList = $http.get(apiURLs, { cache: true});               
      // search data
      $q.all([campDateList]).then(function(results){           
        $scope.count = results[0].data;
        if($scope.count ==0){
           $scope.dataShowHide = false;
           $scope.emptyDataShowHide= true;
        }else{
          $scope.dataShowHide = true;
          $scope.emptyDataShowHide= false;
        }
        $scope.users = []; //declare an empty array
        $scope.pageno = 1; // initialize page no to 1
        $scope.total_count = 0;
        $scope.sort = function(keyname){
          $scope.sortBy = 'session_date';   //set the sortBy to the param passed
          $scope.reverse = false; //if true make it false and vice versa
        }
        $scope.itemsPerPage = 10; //this could be a dynamic value from a drop down
        $scope.getData = function(pageno){ // This would fetch the data on page change.         
          console.log(pageno);
          $scope.campData = []; 
          var p = (pageno*$scope.itemsPerPage)-$scope.itemsPerPage;          
          var apiURL = OPENSRP_WEB_BASE_URL+"/camp-date/search?"+thana+union+ward+unit+health_assistant+"&p="+p+"&limit="+$scope.itemsPerPage;
          var campDateList = $http.get(apiURL, { cache: true}); 
          $q.all([campDateList]).then(function(results){ 
          $scope.users = results[0].data.vaccineEntries;   // data to be displayed on current page.
          $scope.total_count = $scope.count;  // total data count.
         });
          $rootScope.loading = false;
          
      };
      $scope.getData($scope.pageno); // Call the function to fetch initial data on page load.
      });
    }   
    // default data load
  var status = "status=Active";
    var defaultApiURL = OPENSRP_WEB_BASE_URL+"/camp-date/search?"+status+"&p="+0+"&limit="+20;
    var deferred = $q.defer();
    var campDateList = $http.get(defaultApiURL, { cache: false}); 
    $scope.pageNoDefault = 1; // initialize page no to 1         
    $scope.itemsPerPageDefault = 20; //this could be a dynamic value from a drop down
    
    $scope.campData = []; 
    $q.all([campDateList]).then(function(results){      
      $scope.defautData=function(pageno){
        console.log(pageno);
        var p = (pageno*$scope.itemsPerPageDefault)-$scope.itemsPerPageDefault;
        var defaultApiURL = OPENSRP_WEB_BASE_URL+"/camp-date/search?"+status+"&p="+0+"&limit="+20;
        var deferred = $q.defer();
        var campDateList = $http.get(defaultApiURL, { cache: false}); 
        $q.all([campDateList]).then(function(results){ 
          $scope.campData = results[0].data.vaccineEntries;
          $scope.total_count_default = 200; 
        });
      }
      $scope.defautData($scope.pageNoDefault);
    });
    
  }else if(url == 'add'){  // add page
    $scope.addEdit = "Add Session";
	  Camp.getCampList($scope);
    $scope.save = function() {
        $scope.campDateShow = false;       
        $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
        "session_name":$scope.formData.session_name,"health_assistant":$scope.formData.health_assistant.user_name,
        "total_hh":$scope.formData.total_hh,
        "total_population":$scope.formData.total_population,
        "total_adolescent":$scope.formData.total_adolescent,
        "total_women":$scope.formData.total_women,"total_child0":$scope.formData.total_child0,
        "total_child1":$scope.formData.total_child1,"total_child2":$scope.formData.total_child2,
        "created_at":today,"contact":"ff","session_location":$scope.formData.session_location,
        "thana":$scope.formData.thana.id,
        "union":$scope.formData.union.id,"ward":$scope.formData.ward.id,
        "unit":$scope.formData.unit.id,
      }; 
      
      if($scope.campDates.length ==0){
        $scope.campDateShow = true;
      }else{
        $scope.campDateShow = false;         
        Camp.save(angular.toJson($scope.postData),$window,Flash);  
      }
        
    };

  }else if(url =="edit") {   // edit page 
    $rootScope.loading = true;          
    $scope.addEdit = "Edit Session";   
    $scope.datas = Camp.getLocationAndCamp($scope,$routeParams.id);
    $scope.campDateShow = false;   
    $scope.save = function() {    
      $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
      "session_name":$scope.formData.session_name,"health_assistant":$scope.formData.health_assistant.user_name,
      "total_hh":$scope.formData.total_hh,
      "total_population":$scope.formData.total_population,
      "total_adolescent":$scope.formData.total_adolescent,
      "total_women":$scope.formData.total_women,"total_child0":$scope.formData.total_child0,
      "total_child1":$scope.formData.total_child1,"total_child2":$scope.formData.total_child2,
      "created_at":today,"contact":"ff","session_location":$scope.formData.session_location,
      "session_id":$routeParams.id,
      "thana":$scope.formData.thana.id,
      "union":$scope.formData.union.id,
      "ward":$scope.formData.ward.id,
      "unit":$scope.formData.unit.id,
      };   
      
      if($scope.campDates.length ==0){
        $scope.campDateShow = true;
      }else{
        $scope.campDateShow = false;         
        Camp.edit(angular.toJson($scope.postData),$window,Flash);  
      }
     
    }

  }else if(url == "view"){ // view page   
    Camp.getCampById($scope,$routeParams.camp_id );
    $scope.session_date = $routeParams.date;
    $scope.session_status = $routeParams.status;
  }


});
