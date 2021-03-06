'use strict';

/**
 * @ngdoc service
 * @name opensrpSiteApp.scheduleLogService
 * @description
 * # scheduleLogService
 * Service in the opensrpSiteApp.
 */
angular.module('opensrpSiteApp')
  .service('Privilege', function ($http,$rootScope,Base64,OPENSRP_WEB_BASE_URL,Common, COUCHURL) {
        console.log("inside testService");

        this.getPrivilegeById =  function($scope,$rootScope,$timeout,id){
          //http://localhost:5984/opensrp/_design/Privilege/_view/privilege_by_id?key=%225da9913d2e051554a772deae8b02aa0b%22
          var url = COUCHURL+'/opensrp/_design/Privilege/_view/privilege_by_id?key="' + id + '"';              
          $timeout(function () {
            var privilegeData = $http.get(url, { 
              cache: true, 
              withCredentials: false,                  
              headers: {
                'Authorization' : ''
              }
            })
            .success(function (data) {                         
              $rootScope.privilege = data.rows[0];           
              $scope.formData = {};
              $scope.formData.name = data.rows[0].value.name;
              $scope.formData.id = id;
              console.log($scope.formData.name + " -found name with given id - " + $scope.formData.id);
              $rootScope.loading = false;               
              
            });
          }, 250); 
        };
        this.getAllPrivileges = function($scope,$rootScope){
          var couchUrl = COUCHURL + "/opensrp/_design/Privilege/_view/privilege_by_name";
          $http.get(couchUrl, { 
            cache: false, 
            withCredentials: false,
            headers: {
              'Authorization' : ''
            }
          })
          .success(function (data) { 
            console.log("inside success function of privilege promise.");           
            $scope.privileges = data.rows;
          });
        };
        this.save = function(data,$window,Flash, $location){        
          $("#submit").attr('disabled','disabled');
          $("#submit").html("Please Wait");
          var apiURLs = OPENSRP_WEB_BASE_URL+"/add-privilege";       
          $http.post(apiURLs, data).success(function (data) {
            $("#submit").html("Submit");
            $('#submit').prop('disabled', false);
            if (data == 1) {            
              console.log("privilege creation worked.");
              var message = '<strong>Successfully you have created a privilege. </strong> ';                                    
              Flash.create('success', message, 'custom-class');
              //$window.location = '/#/privileges';                  
              $location.url('/privileges');
            }else if (data == 2) {
              console.log("privilege creation didn't work for privilege with same name already exists.");
              $("#message").html("<p class='lead'>Sorry this privilege already exists.</p>");
              $( "#message" ).delay(3000).fadeOut( "slow" );                  
            }else{
              console.log("privilege creation didn't work due to exception.");
               $("#message").html("<p class='lead'>An Error occured.Please try again.</p>");
              $( "#message" ).delay(3000).fadeOut( "slow" );                  
            }
            /*$window.location = '/#/privileges';
            console.log("new privilege created.");*/
          });       
        },
        this.edit = function(data,$window,Flash,id){        
          $("#submit").attr('disabled','disabled');
          $("#submit").html("Please Wait");
          var apiURLs = OPENSRP_WEB_BASE_URL+"/edit-privilege";       
          $http.post(apiURLs, data).success(function (data) {
            $("#submit").html("Submit");
            $('#submit').prop('disabled', false);
            if (data == 1) {            
              var message = '<strong>Successfully you have edited this privilege. </strong> ';
              Flash.create('success', message, 'custom-class');
              $window.location = '/#/privileges';
            }else{
               $("#message").html("<p class='lead'>An Error occured.Please try again. </p>");
              $( "#message" ).delay(3000).fadeOut( "slow" );
            }
            
          });       
        }
   
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
