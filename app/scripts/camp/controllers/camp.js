'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
 .controller('CampCtrl', function ($scope,$http,$rootScope,$routeParams,$q,$location,Flash,Base64,OPENSRP_WEB_BASE_URL,ngDialog,Page,AclService,$window,Camp) {
  var today = Camp.dateFormatterTodayInYYYYMMDD();
  var first= new Date(today);  
  $scope.formData = [];
  $scope.campDates = [];
  $scope.campDate = [];
  $scope.statusValue = [];
  $scope.show = false;
  var url = $location.path().split("/")[2];
  console.log(url);
  

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
  });
  $scope.unionList =[{"id":"232dffr232","name":"UBC"},{"id":"2w3432232","name":"UDBC"},{"id":"2cfr32232","name":"UEBC"}];
  $scope.getUnion = function(){
      
      if($scope.formData.thana ==""){
        $scope.unionList =[];        
       
      }else{
        
          var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.thana;
          var unionList = $http.get(unionListURL, { cache: false});
          $q.all([unionList]).then(function(results){
          $scope.unionList = results[0].data;
        });
        //$scope.unionList =[{"id":"232dffr232","name":"UBC"},{"id":"2w3432232","name":"UDBC"},{"id":"2cfr32232","name":"UEBC"}];
      }
    }
    $scope.getWard = function(){
      
      var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.union;
      var wardList = $http.get(wardListURL, { cache: false});
      $q.all([wardList]).then(function(results){
        $scope.wardList = results[0].data;
      });
       //$scope.wardList =[{"id":"rff232232","name":"WUBC"},{"id":"rffgg232232","name":"WUDBC"},{"id":"rgtff232232","name":"WUEBC"}];
    }

    $scope.getUnit = function(){
      
      var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.formData.ward;
      var units = $http.get(wardListURL, { cache: false});
      $q.all([units]).then(function(results){
        $scope.unitList = results[0].data;
      });
       //$scope.unitList =[{"id":"rffrtf232232","name":"UWUBC"},{"id":"rffet232232","name":"UWUDBC"},{"id":"rrtf232232","name":"UWUEBC"}];

    }
    
      $scope.healthAssistantList =[{"name":"sohel"},{"name":"asif"},{"name":"numera"}];
  
  
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
      $scope.campDates.push({'session_date':$scope.formData.date,'status':$scope.formData.status});
      console.log($scope.campDates);     
      $scope.formData.date ="";
      $scope.formData.status ="";
      $scope.show = false;
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
    var apiURLs = OPENSRP_WEB_BASE_URL+"/all-camp-date";
    var deferred = $q.defer();
    var allCamp = $http.get(apiURLs, { cache: false});               
    $q.all([allCamp]).then(function(results){           
      $scope.data = results[0].data; 
     
      Camp.data($scope,$scope.data); 
    });
     
  }else if(url == 'add'){  // add page
    

    $scope.save = function() {    
        $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
        "session_name":$scope.formData.session_name,"health_assistant":$scope.formData.health_assistant,
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
      Camp.save(angular.toJson($scope.postData),$window,Flash);    
    };

  }else if(url =="edit") {   // edit page
    //Camp.getCampById($scope,$routeParams.id );
    $scope.datas = Camp.getLocation($scope,$routeParams.id);
   
    $scope.save = function() {    
      $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
      "session_name":$scope.formData.session_name,"health_assistant":$scope.formData.health_assistant,
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
      Camp.edit(angular.toJson($scope.postData),$window,Flash);
    }

  }else if(url == "view"){ // view page
    console.log($routeParams.camp_id)
    Camp.getCampById($scope,$routeParams.camp_id );
    $scope.session_date = $routeParams.date;
  }


});
