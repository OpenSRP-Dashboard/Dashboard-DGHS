'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
  .controller('CampCtrl', function ($scope,$http,$rootScope,$q,Base64,OPENSRP_WEB_BASE_URL,ngDialog,Page,AclService,calendarConfig,$window) {
    
    var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
        alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
        alert.show('Deleted', args.calendarEvent);
      }
    }];
    var f= "ddd ddd   ddd  ";
    vm.events = [
      {
        title: 'An event <br /> name: '+f,
        color: calendarConfig.colorTypes.warning,
        startsAt: moment('2016-06-01').startOf('day').add(10, 'hours').toDate(),
        endsAt: moment('2016-06-01').startOf('day').add(22, 'hours').toDate(),
        draggable: true,
        resizable: true,
        //actions: actions
      }, {
        title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
        color: calendarConfig.colorTypes.info,
        startsAt: moment().subtract(1, 'day').toDate(),
        endsAt: moment().add(5, 'days').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: '<a href="">This is a really long event title that occurs on every year</a>',
        color: calendarConfig.colorTypes.important,
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        draggable: true,
        resizable: true,
        actions: actions
      }
    ];

    vm.isCellOpen = true;

    vm.addEvent = function() {
      vm.events.push({
        title: 'New event',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: true,
        resizable: true
      });
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
    $scope.formData = [];
    $scope.campDates = [];
    $scope.campDate = [];
    $scope.statusValue = [];
    $scope.show = false;
    
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
       var postData = {"camp_dates":$scope.campDates,"created_by":"sohel","session_name":$scope.formData.session_name,"health_assistant":"","total_hh":$scope.formData.session_name.total_hh,
       "total_population":$scope.formData.total_population,"total_adolescent":$scope.formData.total_adolescent,
       "total_women":$scope.formData.total_women,"total_child0":$scope.formData.total_child0,
       "total_child1":$scope.formData.total_child1,"total_child2":$scope.formData.total_child2,
       "created_at":"","contact":"","session_location":$scope.formData.session_location
       };
      
      console.log(JSON.stringify(postData));
     
        
    };
  });
