'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
 .controller('CampCtrl', function ($scope,$http,$rootScope,$routeParams,$q,$location,$cookies,Flash,Base64,OPENSRP_WEB_BASE_URL,ngDialog,AclService,$window,Camp,Common,LocationTree) {
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
 LocationTree.location_tree($scope);
  
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
 if(url =='search'){
    Common.createUserCondition($scope,$cookies);
    Camp.getCampList($scope);

 }else if(url =='list'){ 
    $scope.dataShowHide = true;      
    // default data load
    console.log($cookies.get('locationId'));
    var userCondition = "";
      if($cookies.get('roleName') =="Admin"){
        userCondition = "";
      }else if($cookies.get('roleName') =="HI"){
        userCondition = "&thana="+$cookies.get('locationId');
      }else if($cookies.get('roleName') =="AHI"){
        userCondition = "&union="+$cookies.get('locationId');
      }else if($cookies.get('roleName') =="HA"){
        userCondition = "&health_assistant="+$rootScope.username;
      }else{

      }
    var status = "&status=Active&type=CampDate";
    var defaultApiURL = OPENSRP_WEB_BASE_URL+"/camp-count-by-keys?"+status+userCondition;
    var deferred = $q.defer();
    var campDateCount = $http.get(defaultApiURL, { cache: false}); 
    $scope.pageno = 1; // initialize page no to 1         
    $scope.itemsPerPage = 10; //this could be a dynamic value from a drop down    
    $scope.campData = []; 
    $q.all([campDateCount]).then(function(results){
        $scope.count = results[0].data ; 
        console.log($scope.count); 
        $scope.defautData=function(pageno){       
          var p = (pageno*$scope.itemsPerPage)-$scope.itemsPerPage;
          var defaultApiURL = OPENSRP_WEB_BASE_URL+"/camp-date/search?"+userCondition+status+"&p="+p+"&limit="+$scope.itemsPerPage;
          var deferred = $q.defer();
          var campDateList = $http.get(defaultApiURL, { cache: false}); 
          $q.all([campDateList]).then(function(results){ 
            $scope.campData = results[0].data.vaccineEntries;
            $scope.total_count =  $scope.count; 
          });
      }
      $scope.defautData($scope.pageno);
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
  }else{
    console.log("Wrong path.....");
  }
  $scope.search = function(){
      var thana;
      var union;
      var unit;
      var ward;
      var healthAssistant;
      var thana_for_count="";
      var union_for_count ="";
      var ward_for_count ="";
      var unit_for_count ="";
      var campName = "";
      var health_assistant_for_count ="";
      if(!angular.isObject($scope.formData.thana)){
        thana ="";       
      }else{
        thana = "&thana="+$scope.formData.thana.id;       
      }
      if(!angular.isObject($scope.formData.union)){
        union = "";
      }else{        
        union = "&union="+$scope.formData.union.id;        
      }
      if(!angular.isObject($scope.formData.ward)){
        ward = "";
      }else{
        ward = "&ward="+$scope.formData.ward.id;        
      }
      if(!angular.isObject($scope.formData.unit)){
        unit = "";
      }else{
        unit = "&unit="+$scope.formData.unit.id;        
      }
      if(!angular.isObject($scope.formData.health_assistant)){
        healthAssistant = "";
      }else{
        healthAssistant = "&health_assistant="+$scope.formData.health_assistant.user_name;
        
      }
      if($scope.formData.session_name =="" || $scope.formData.session_name==null){       
        campName ="";
      }else{        
        campName = "&session_name="+'"'+$scope.formData.session_name+'"';      
      } 
      $rootScope.loading = true;      
      var apiURLs = OPENSRP_WEB_BASE_URL+"/camp-count-by-keys?type=CampDate"+thana+union+ward+unit+healthAssistant+campName;
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
        $scope.searchData = []; //declare an empty array
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
          var apiURL = OPENSRP_WEB_BASE_URL+"/camp-date/search?type=CampDate"+thana+union+ward+unit+healthAssistant+campName+"&p="+p+"&limit="+$scope.itemsPerPage;
          var campDateList = $http.get(apiURL, { cache: true}); 
          $q.all([campDateList]).then(function(results){ 
          $scope.searchData = results[0].data.vaccineEntries;   // data to be displayed on current page.
          $scope.total_count = $scope.count;  // total data count.
         });
          $rootScope.loading = false;
          
      };
      $scope.getData($scope.pageno); // Call the function to fetch initial data on page load.
      });
    } 

});
