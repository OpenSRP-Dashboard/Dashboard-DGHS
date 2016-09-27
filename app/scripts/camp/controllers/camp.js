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
 $("#session_date").on("change", function() {
        $scope.formData.date = $("#session_date").val();
  });
  if($location.path() =='/camp'){
       
    var apiURLs = OPENSRP_WEB_BASE_URL+"/all-camp-date";
    var deferred = $q.defer();
    var allCamp = $http.get(apiURLs, { cache: false});               
    $q.all([allCamp]).then(function(results){           
      $scope.data = results[0].data; 
      console.log($scope.data); 
      Camp.data($scope,$scope.data); 
      
 
});
     
}else if($location.path() == '/camp/add'){
  

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
  $scope.removeCampDate = function(date){     
    for(var i = $scope.campDates.length - 1; i >= 0; i--) {
      if($scope.campDates[i].session_date === date) {
       $scope.campDates.splice(i, 1);
     }
   }

  }
  $scope.statuses = [
  {'name': 'InActive','value':0},
  {'name': 'Active','value':1}

  ];
  window.sta = $scope.statuses;
  $scope.save = function(){
   console.log($scope);
   $window.location = '/#/camp/date/1';
  }


  $scope.save = function() {    
      $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
      "session_name":$scope.formData.session_name,"health_assistant":"sohel",
      "total_hh":$scope.formData.total_hh,
      "total_population":$scope.formData.total_population,
      "total_adolescent":$scope.formData.total_adolescent,
      "total_women":$scope.formData.total_women,"total_child0":$scope.formData.total_child0,
      "total_child1":$scope.formData.total_child1,"total_child2":$scope.formData.total_child2,
      "created_at":today,"contact":"ff","session_location":$scope.formData.session_location,
    }; 
    Camp.save(angular.toJson($scope.postData),$window,Flash);    
  };

 }else {

  var apiURLs = OPENSRP_WEB_BASE_URL+"/camp?id="+$routeParams.id;
  var deferred = $q.defer();
  var camp = $http.get(apiURLs, { cache: false});               
    $q.all([camp]).then(function(results){
      var camp = results[0].data;
      console.log(camp);
      $scope.formData.session_name = camp.session_name;
      $scope.formData.session_location = camp.session_location;
      $scope.formData.total_hh = parseInt(camp.total_hh);
      $scope.formData.total_population = parseInt(camp.total_population);
      $scope.formData.total_adolescent = parseInt(camp.total_adolescent);
      $scope.formData.total_women = parseInt(camp.total_women);
      $scope.formData.total_child0 = parseInt(camp.total_child0);
      $scope.formData.total_child1 = parseInt(camp.total_child1);
      $scope.formData.total_child2 = parseInt(camp.total_child2);

      for (var i = 0; i < camp.camp_dates.length; i++) {
        $scope.campDates.push({'session_date':camp.camp_dates[i].session_date,'status':camp.camp_dates[i].status});
      }

  });   

    $scope.save = function() {
    console.log($scope.formData);     

    $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
    "session_name":$scope.formData.session_name,"health_assistant":"sohel",
    "total_hh":$scope.formData.total_hh,
    "total_population":$scope.formData.total_population,
    "total_adolescent":$scope.formData.total_adolescent,
    "total_women":$scope.formData.total_women,"total_child0":$scope.formData.total_child0,
    "total_child1":$scope.formData.total_child1,"total_child2":$scope.formData.total_child2,
    "created_at":today,"contact":"ff","session_location":$scope.formData.session_location,
    "session_id":$routeParams.id,
  };   
  console.log($scope.postData);
  Camp.edit(angular.toJson($scope.postData),$window,Flash);
}

}// end else if

});
