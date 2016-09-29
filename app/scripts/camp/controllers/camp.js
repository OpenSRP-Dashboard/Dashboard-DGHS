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

  $scope.selectd = function(id,list){
  console.log("Name:"+id)    
    for (var i = 0; i < list.length; i++) {
      if(list.id ==id){        
        return true;
      }
    };
    return false;
  }
  
  $scope.thanaList =[{"id":"232dd232","name":"ABC"},{"id":"232232","name":"DBC"},{"id":"23fdfd2232","name":"EBC"}];
    console.log($scope.thanaList.length)
    $scope.getUnion = function(){
      console.log($scope.formData.thana)
      if($scope.formData.thana ==""){
        $scope.unionList =[];
        console.log(444444444);
        $scope.selected = true;
      }else{
        $scope.unionList =[{"id":"232dffr232","name":"UBC"},{"id":"2w3432232","name":"UDBC"},{"id":"2cfr32232","name":"UEBC"}];
      }
    }
    $scope.getWard = function(){
      console.log($scope.formData.union)
       $scope.wardList =[{"id":"rff232232","name":"WUBC"},{"id":"rffgg232232","name":"WUDBC"},{"id":"rgtff232232","name":"WUEBC"}];
    }

    $scope.getUnit = function(){
      console.log($scope.formData.ward);
       $scope.unitList =[{"id":"rffrtf232232","name":"UWUBC"},{"id":"rffet232232","name":"UWUDBC"},{"id":"rrtf232232","name":"UWUEBC"}];

    }
    $scope.getHealthAssistant = function(){
      console.log($scope.formData.unit);
      $scope.healthAssistantList =[{"name":"sohel"},{"name":"asif"},{"name":"numera"}];
    }
  
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
      console.log($scope.data); 
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
        "thana":$scope.formData.thana,
        "union":$scope.formData.union,"ward":$scope.formData.ward,
        "unit":$scope.formData.unit,
      }; 
      console.log(angular.toJson($scope.postData));
      Camp.save(angular.toJson($scope.postData),$window,Flash);    
    };

  }else if(url =="edit") {   // edit page
    Camp.getCampById($scope,$routeParams.id );
    $scope.save = function() {    
      $scope.postData = {"camp_dates":$scope.campDates,"created_by":$rootScope.username,
      "session_name":$scope.formData.session_name,"health_assistant":"sohel",
      "total_hh":$scope.formData.total_hh,
      "total_population":$scope.formData.total_population,
      "total_adolescent":$scope.formData.total_adolescent,
      "total_women":$scope.formData.total_women,"total_child0":$scope.formData.total_child0,
      "total_child1":$scope.formData.total_child1,"total_child2":$scope.formData.total_child2,
      "created_at":today,"contact":"ff","session_location":$scope.formData.session_location,
      "session_id":$routeParams.id,
      "thana":$scope.formData.thana,
      "union":$scope.formData.union,"ward":$scope.formData.ward,
      "unit":$scope.formData.unit,
      };   
      console.log($scope.postData);
      Camp.edit(angular.toJson($scope.postData),$window,Flash);
    }

  }else if(url == "view"){ // view page
    console.log($routeParams.camp_id)
    Camp.getCampById($scope,$routeParams.camp_id );
    $scope.session_date = $routeParams.date;
  }

});
