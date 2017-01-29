

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

    data: function($scope,data,count){ 
      console.log($scope.currentPage)   
      $scope.sortReverse  = true;
      $scope.currentPage = 1;
      $scope.sortType = 'session_date';
      $scope.totalItems = count;        
      $scope.entryLimit = 20; // items per page        
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
  getCampById: function($scope,id){
    var apiURLs = OPENSRP_WEB_BASE_URL+"/camp?id="+id;
    var camp = $http.get(apiURLs, { cache: false});
    $q.all([camp]).then(function(results){
      $scope.camp = results[0].data; 
      $scope.formData.session_name = $scope.camp.session_name;
      $scope.formData.session_location = $scope.camp.session_location;
      $scope.formData.total_hh = parseInt($scope.camp.total_hh);
      $scope.formData.total_population = parseInt($scope.camp.total_population);
      $scope.formData.total_adolescent = parseInt($scope.camp.total_adolescent);
      $scope.formData.total_women = parseInt($scope.camp.total_women);
      $scope.formData.total_child0 = parseInt($scope.camp.total_child0);
      $scope.formData.total_child1 = parseInt($scope.camp.total_child1);
      $scope.formData.total_child2 = parseInt($scope.camp.total_child2);
      for (var i = 0; i < $scope.camp.camp_dates.length; i++) {
        $scope.campDates.push({'session_date':$scope.camp.camp_dates[i].session_date,'status':$scope.camp.camp_dates[i].status});
      }

      });
    
  },
  getCampList: function($scope){
    var apiURLs = OPENSRP_WEB_BASE_URL+"/camp-name";
    var campNameList = $http.get(apiURLs, { cache: false});
    $q.all([campNameList]).then(function(results){
      $scope.sessionNameList = results[0].data;      
		
      });
    
  },
  getLocationAndCamp: function($scope,id){
    // get camp data with id for edit camp data
    var apiURLs = OPENSRP_WEB_BASE_URL+"/camp?id="+id;
    var camp = $http.get(apiURLs, { cache: false});
   
    // get thana list to show on select box
    var thanaAPIURL = OPENSRP_WEB_BASE_URL+"/get-upazillas";
    var locations =  $http.get(thanaAPIURL, { cache: false});
    
     var apiURLs = OPENSRP_WEB_BASE_URL+"/camp-name";
    var campNameList = $http.get(apiURLs, { cache: false});
    
    
    $q.all([camp,locations,campNameList]).then(function(results){
		
      $scope.camp = results[0].data;      
      $scope.thanaList = results[1].data;
      $scope.sessionNameList = results[2].data;
      
      setSessionNameSelected($scope.camp.session_name,$scope.sessionNameList,'session_name',$scope);
      
      $scope.formData.session_name = $scope.camp.session_name;
      $scope.formData.session_location = $scope.camp.session_location;
      $scope.formData.total_hh = parseInt($scope.camp.total_hh);
      $scope.formData.total_population = parseInt($scope.camp.total_population);
      $scope.formData.total_adolescent = parseInt($scope.camp.total_adolescent);
      $scope.formData.total_women = parseInt($scope.camp.total_women);
      $scope.formData.total_child0 = parseInt($scope.camp.total_child0);
      $scope.formData.total_child1 = parseInt($scope.camp.total_child1);
      $scope.formData.total_child2 = parseInt($scope.camp.total_child2);
      for (var i = 0; i < $scope.camp.camp_dates.length; i++) {
        $scope.campDates.push({'session_date':$scope.camp.camp_dates[i].session_date,'status':$scope.camp.camp_dates[i].status,'deleted':$scope.camp.camp_dates[i].deleted});
      }
      

      var unionListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.camp.camp_dates[0].thana;
      var unionList = $http.get(unionListURL, { cache: false});
      var wardListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.camp.camp_dates[0].union;
      var wardList = $http.get(wardListURL, { cache: false});
      
      var unitListURL = OPENSRP_WEB_BASE_URL+"/get-children-locations?dashboardLocationId="+$scope.camp.camp_dates[0].ward;
      var unitList = $http.get(unitListURL, { cache: false});
      
      var userListURL = OPENSRP_WEB_BASE_URL+"/get-data-senders-by-location?locationId="+$scope.camp.camp_dates[0].unit;
      var userList = $http.get(userListURL, { cache: false});
      
      $q.all([unionList,wardList,unitList,userList]).then(function(response){
        $scope.unionList = response[0].data;
        $scope.wardList = response[1].data;
        $scope.unitList = response[2].data;   
        $scope.healthAssistantList = response[3].data;            
        //for thana selected options
        setSelectedValue($scope.camp.camp_dates[0].thana,$scope.thanaList,'thana',$scope);
         //for union selected options
        setSelectedValue($scope.camp.camp_dates[0].union,$scope.unionList,'union',$scope);
        // for ward selected options
        setSelectedValue($scope.camp.camp_dates[0].ward,$scope.wardList,'ward',$scope);
        //for unit selected options
        setSelectedValue($scope.camp.camp_dates[0].unit,$scope.unitList,'unit',$scope);
        setSelectedValueForUser($scope.camp.camp_dates[0].health_assistant,$scope.healthAssistantList,'health_assistant',$scope);
       
      });
      
     }); 
  },
}
function setSelectedValue(id,list,variable,$scope){
  for(var i =0;i<list.length;i++){ 
    if (id == list[i].id ) {  
      $scope.formData[variable] = list[i] ;                                      
      break;
    }             
  }
}

function setSelectedValueForUser(name,list,variable,$scope){	
  for(var i =0;i<list.length;i++){ 
    if (name == list[i].user_name ) {
      $scope.formData[variable] = list[i] ;                                      
      break;
    }             
  }
}

function setSessionNameSelected(name,list,variable,$scope){
	for(var i =0;i<list.length;i++){ 
    if (name == list[i] ) {
      $scope.formData[variable] = list[i] ;                                      
      break;
    }             
  }
}	

});
