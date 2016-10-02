'use strict';

angular.module('opensrpSiteApp')
.service('Camp', function ($q, $http, OPENSRP_WEB_BASE_URL, $rootScope,filterFilter) {     


  return{ 
    save: function(data,$window,Flash){
      console.log(333);
      $("#submit").attr('disabled','disabled');
      $("#submit").html("Please Wait");
      var apiURLs = OPENSRP_WEB_BASE_URL+"/add-camp";       
      $http.post(apiURLs, data).success(function (data) {
        $("#submit").html("Submit");
        $('#submit').prop('disabled', false);
        if (data == 1) {            
          var message = '<strong>Successfully created a sesion. </strong> ';
          Flash.create('success', message, 'custom-class');
          $window.location = '/#/camp/list';
        }else if (data == 2) {
          $("#message").html("<p class='lead'>This session already exists</p>");
          $( "#message" ).delay(3000).fadeOut( "slow" );
        }else{
         $("#message").html("<p class='lead'>Failed to create session</p>");
         $( "#message" ).delay(3000).fadeOut( "slow" );
       }

     });       
    },

    edit: function(data,$window,Flash){
      console.log(333);
      $("#submit").attr('disabled','disabled');
      $("#submit").html("Please Wait");
      var apiURLs = OPENSRP_WEB_BASE_URL+"/edit-camp";       
      $http.post(apiURLs, data).success(function (data) {
        $("#submit").html("Submit");
        $('#submit').prop('disabled', false);
        if (data == 1) {            
          var message = '<strong>Successfully updated  session. </strong> ';
          Flash.create('success', message, 'custom-class');
          $window.location = '/#/camp/list';
        }else{
         $("#message").html("<p class='lead'>Failed to update session</p>");
         $( "#message" ).delay(3000).fadeOut( "slow" );
       }

     });       
    },

    data: function($scope,data){
     console.log(333)
     $scope.sortReverse  = false;
     $scope.currentPage = 1;
     $scope.totalItems = data.length;        
        $scope.entryLimit = 10; // items per page
        console.log($scope.entryLimit);
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

      },

      dateFormatterTodayInYYYYMMDD : function(){
       var today = new Date();
       var dd = today.getDate();
	    var mm = today.getMonth()+1; //January is 0!
	    var yyyy = today.getFullYear();
	    if(dd<10) {
       dd='0'+dd
     } 
     if(mm<10) {
       mm='0'+mm
     }
     today = yyyy+'-'+mm+'-'+dd;
     return today;	    
   },
   getCampList : function($rootScope,$scope,$q){
    var apiURLs = OPENSRP_WEB_BASE_URL+"/all-camp";
    var deferred = $q.defer();
    $http.get(apiURLs, { cache: false})
    .success(function (data) {  
     deferred.resolve({
      data: data,
    }); 
   }); 
    return deferred.promise;       
  },

  getDateDiff: function(first,second){
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;
    return Math.floor(days);
  },
  getLocation: function($scope,id){
    var apiURLs = OPENSRP_WEB_BASE_URL+"/camp?id="+id;
    var camp = $http.get(apiURLs, { cache: false});
    var thanaAPIURL = OPENSRP_WEB_BASE_URL+"/get-upazillas";
    var locations =  $http.get(thanaAPIURL, { cache: false});
    
    $q.all([camp,locations]).then(function(results){
      $scope.camp = results[0].data;
      //console.log("Camp");
      //console.log($scope.camp);
      $scope.thanaList = results[1].data;
      var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.camp.camp_dates[0].thana;
      var unionList = $http.get(unionListURL, { cache: false});
      var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.camp.camp_dates[0].union;
      var wardList = $http.get(wardListURL, { cache: false});
      var unitListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.camp.camp_dates[0].ward;
      var unitList = $http.get(unitListURL, { cache: false});
      $q.all([unionList,wardList,unitList]).then(function(response){
        $scope.unionList = response[0].data;
        $scope.wardList = response[1].data;
        $scope.unitList = response[2].data;
        //console.log("Union");
        //console.log($scope.unions);
      });
      
     }); 
  },

  getCampById: function($scope,id){
    var apiURLs = OPENSRP_WEB_BASE_URL+"/camp?id="+id;
    var deferred = $q.defer();
    var camp = $http.get(apiURLs, { cache: false});               
    $q.all([camp]).then(function(results){
      var camp = results[0].data; 
      //console.log(camp);       
      $scope.formData.session_name = camp.session_name;
      $scope.formData.session_location = camp.session_location;
      $scope.formData.total_hh = parseInt(camp.total_hh);
      $scope.formData.total_population = parseInt(camp.total_population);
      $scope.formData.total_adolescent = parseInt(camp.total_adolescent);
      $scope.formData.total_women = parseInt(camp.total_women);
      $scope.formData.total_child0 = parseInt(camp.total_child0);
      $scope.formData.total_child1 = parseInt(camp.total_child1);
      $scope.formData.total_child2 = parseInt(camp.total_child2);

      $scope.formData.thana = camp.camp_dates[0].thana;
      $scope.formData.union = camp.camp_dates[0].union;
      $scope.formData.ward = camp.camp_dates[0].ward;
      $scope.formData.unit = camp.camp_dates[0].unit;
      //$scope.unitEdit = camp.camp_dates[0].unit;
      for (var i = 0; i < camp.camp_dates.length; i++) {
        $scope.campDates.push({'session_date':camp.camp_dates[i].session_date,'status':camp.camp_dates[i].status});
      }

    });   
  }

}

});
