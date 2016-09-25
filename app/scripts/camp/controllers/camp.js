'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
 .controller('CampCtrl', function ($scope,$http,$rootScope,$routeParams,$q,$location,Flash,Base64,OPENSRP_WEB_BASE_URL,ngDialog,Page,AclService,calendarConfig,$window,Camp) {
  var today = Camp.dateFormatterTodayInYYYYMMDD();
  var first= new Date(today);
  
  $scope.formData = [];
  $scope.campDates = [];
  $scope.campDate = [];
  $scope.statusValue = [];
  $scope.show = false;
  console.log($location.path());
  if($location.path() =='/camp'){
    var vm = this;    
    vm.calendarView = 'month';
    vm.viewDate = new Date();    
    var apiURLs = OPENSRP_WEB_BASE_URL+"/all-camp";
    var deferred = $q.defer();
    var allCamp = $http.get(apiURLs, { cache: false});               
    $q.all([allCamp]).then(function(results){           
      $scope.data = results[0].data;    
      vm.events = [];
      for (var i = 0; i < $scope.data.length; i++) {
        var campDates = $scope.data[i].camp_dates;      
        for (var j = 0; j < campDates.length; j++) {
         var second= new Date(campDates[j].session_date);
         var days = Camp.getDateDiff(first,second);
         if(days <= 7){         
          vm.events.push({title: '<b>Session name:</b> '+$scope.data[i].session_name + " ,  <b>Session Location:</b> "+$scope.data[i].session_location
            +" ,  <b>health_assistant:</b> "+ $scope.data[i].health_assistant + ", <b>Total HH:</b>"+ $scope.data[i].total_hh+",  <b>15 yrs aged adolescent no.:</b> "+ $scope.data[i].total_adolescent+
            ", <b> 0-11 month aged child no.:</b> "+$scope.data[i].total_child0+",  <b>,12-23 month aged child no.:</b> "+$scope.data[i].total_child1+
            " , <b>0-5 yrs aged child no.:</b>" + $scope.data[i].total_child2 +" , <b>Total population:</b>"+ $scope.data[i].total_population 
            +", <b>15-49 yrs aged women no.: </b>"+ $scope.data[i].total_women +"<br />" ,
            color: calendarConfig.colorTypes.important,

            startsAt: moment(campDates[j].session_date).startOf('day').add(9, 'hours').toDate(),
            endsAt: moment(campDates[j].session_date).startOf('day').add(17, 'hours').toDate(),
            draggable: false,
            resizable: false,
          })
  }else if(days <=15){
    vm.events.push({title: '<b>Session name:</b> '+$scope.data[i].session_name + " ,  <b>Session Location:</b> "+$scope.data[i].session_location
      +" ,  <b>health_assistant:</b> "+ $scope.data[i].health_assistant + ", <b>Total HH:</b>"+ $scope.data[i].total_hh+",  <b>15 yrs aged adolescent no.:</b> "+ $scope.data[i].total_adolescent+
      ", <b> 0-11 month aged child no.:</b> "+$scope.data[i].total_child0+",  <b>,12-23 month aged child no.:</b> "+$scope.data[i].total_child1+
      " , <b>0-5 yrs aged child no.:</b>" + $scope.data[i].total_child2 +" , <b>Total population:</b>"+ $scope.data[i].total_population 
      +", <b>15-49 yrs aged women no.: </b>"+ $scope.data[i].total_women +"<br />" ,
      color: calendarConfig.colorTypes.warning,

      startsAt: moment(campDates[j].session_date).startOf('day').add(9, 'hours').toDate(),
      endsAt: moment(campDates[j].session_date).startOf('day').add(17, 'hours').toDate(),
      draggable: false,
      resizable: false,
    })
  }else{
    vm.events.push({title: '<a href="#">html</a><b>Session name:</b> '+$scope.data[i].session_name + " ,  <b>Session Location:</b> "+$scope.data[i].session_location
      +" ,  <b>health_assistant:</b> "+ $scope.data[i].health_assistant + ", <b>Total HH:</b>"+ $scope.data[i].total_hh+",  <b>15 yrs aged adolescent no.:</b> "+ $scope.data[i].total_adolescent+
      ", <b> 0-11 month aged child no.:</b> "+$scope.data[i].total_child0+",  <b>,12-23 month aged child no.:</b> "+$scope.data[i].total_child1+
      " , <b>0-5 yrs aged child no.:</b>" + $scope.data[i].total_child2 +" , <b>Total population:</b>"+ $scope.data[i].total_population 
      +", <b>15-49 yrs aged women no.: </b>"+ $scope.data[i].total_women +"<br />" ,
      color: calendarConfig.colorTypes.info,

      startsAt: moment(campDates[j].session_date).startOf('day').add(9, 'hours').toDate(),
      endsAt: moment(campDates[j].session_date).startOf('day').add(17, 'hours').toDate(),
      draggable: false,
      resizable: false,
    })
  }
  };
  };

  vm.isCellOpen = true;
  vm.addEvent = function() {

  };

  vm.eventClicked = function(event) {
    alert.show('Clicked', event);
  };

  vm.eventEdited = function(event) {
    alert.show('Edited', event);
  };

  vm.eventDeleted = function(event) {
    alert.show('Deleted', event);
  };

  vm.eventTimesChanged = function(event) {
    alert.show('Dropped or resized', event);
  };

  vm.toggle = function($event, field, event) {
    $event.preventDefault();
    $event.stopPropagation();
    event[field] = !event[field];
  };
  });    
}else if($location.path() == '/camp/add'){
  

  $scope.addCampDate = function(){

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
    console.log($scope.formData);     

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
