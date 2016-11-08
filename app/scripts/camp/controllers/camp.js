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
  console.log(url);
  $scope.can = AclService.can;

  $scope.selectdd = function(id,list){     

    for (var j = 0; j<list.length; j++) {  
      console.log(list[j].id ); 
      if(list[j].id == id){  
      console.log(j);          
        return true;
        break;       
      }else{
         console.log(44344); 
         return false;
      }
    };
   
  }
  $scope.removeShowHide = function(condition){
	  
	  if(condition == 'true' || condition==""){
		  return true
	  }else{
		return false;
	 }	
  }
  $scope.selectd = function(id,list){
     //console.log(list.length);
    for (var i = 0; i <list.length; i++) {
      if(list[i].id ==id){        
        return true;
      }
    };
    return false;
  }
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
    
    //$scope.healthAssistantList =[{"name":"sohel"},{"name":"asif"},{"name":"numera"}];
  
  
  $scope.removeCampDate = function(date){     
    for(var i = $scope.campDates.length - 1; i >= 0; i--) {
      if($scope.campDates[i].session_date === date) {
       $scope.campDates.splice(i, 1);
     }
   }
  }
   $scope.addCampDate = function(){   
    console.log($scope.formData.date);
    if ($scope.formData.date == undefined || $scope.formData.date == ''
      || $scope.formData.status == undefined || $scope.formData.status == '' ) {
     $scope.show = true;
    }else{
      $scope.campDates.push({'session_date':$scope.formData.date,'status':$scope.formData.status,'deleted':true});
      console.log($scope.campDates);     
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
    $scope.dataShowHide = false;
    $scope.search = function(){

      var thana;
      var union;
      var unit;
      var ward;
      var health_assistant;
      if($scope.formData.thana =='undefined'){
        thana ="";
      }else{
        thana = $scope.formData.thana.id;
      }
      if(!angular.isObject($scope.formData.union)){
        union = "";
      }else{
        console.log(444);
        union = $scope.formData.union.id;
      }
      if(!angular.isObject($scope.formData.ward)){
        ward = "";
      }else{
        ward = $scope.formData.ward.id;
      }
      if(!angular.isObject($scope.formData.unit)){
        unit = "";
      }else{
        unit = $scope.formData.unit.id;
      }
      if(!angular.isObject($scope.formData.health_assistant)){
        health_assistant = "";
      }else{
        health_assistant = $scope.formData.health_assistant.user_name;
      }
      
      var apiURLs = OPENSRP_WEB_BASE_URL+"/camp/search?thana="+thana+"&union="+union
      +"&ward="+ward+"&unit="+unit+"&healthAssistant="+health_assistant;
      console.log(apiURLs);
      var deferred = $q.defer();
      var campDateList = $http.get(apiURLs, { cache: false});               
      // search data
      $q.all([campDateList]).then(function(results){           
        $scope.data = results[0].data;
        if($scope.data.length ==0){
         $scope.dataShowHide = false;
         $scope.emptyDataShowHide= true;
      }else{
        $scope.dataShowHide = true;
        $scope.emptyDataShowHide= false;
      }        
        Camp.data($scope,$scope.data); 
      });
    }   
    //default data   
    var apiURLs = OPENSRP_WEB_BASE_URL+"/all-camp-date";
    var deferred = $q.defer();
    var allCamp = $http.get(apiURLs, { cache: false});               
    
    $q.all([allCamp]).then(function(results){           
      $scope.data = results[0].data;
      if($scope.data.length ==0){
         $scope.dataShowHide = false;
         $scope.emptyDataShowHide= true;
      }else{
        $scope.dataShowHide = true;
        $scope.emptyDataShowHide= false;
      }
     
      Camp.data($scope,$scope.data); 
    });
     
  }else if(url == 'add'){  // add page
    $scope.addEdit = "Add Session";
	Camp.getCampList($scope);
    $scope.save = function() { 
     
        $scope.campDateShow = false;
        console.log($scope.campDates.length);  
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
      console.log(angular.toJson($scope.postData));
      if($scope.campDates.length ==0){
        $scope.campDateShow = true;
      }else{
         $scope.campDateShow = false;         
        Camp.save(angular.toJson($scope.postData),$window,Flash);  
      }
        
    };

  }else if(url =="edit") {   // edit page 
    $scope.addEdit = "Edit Session";   
    $scope.datas = Camp.getLocationAndCamp($scope,$routeParams.id);
    $scope.campDateShow = false; 
    console.log("edit");  
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
      console.log(angular.toJson($scope.postData));
      if($scope.campDates.length ==0){
        $scope.campDateShow = true;
      }else{
         $scope.campDateShow = false;         
        Camp.edit(angular.toJson($scope.postData),$window,Flash);  
      }
     
    }

  }else if(url == "view"){ // view page
    console.log($routeParams.camp_id)
    Camp.getCampById($scope,$routeParams.camp_id );
    $scope.session_date = $routeParams.date;
    $scope.session_status = $routeParams.status;
  }


});
