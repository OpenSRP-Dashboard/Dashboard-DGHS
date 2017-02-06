'use strict';

/**
 * @ngdoc service
 * @name opensrpSiteApp.ACCESSTOKENS
 * @description
 * # ACCESSTOKENS
 * Service in the opensrpSiteApp.
 */
angular.module('opensrpSiteApp')
  .service('User', function ($http,$rootScope,Base64,OPENSRP_WEB_BASE_URL, COUCHURL, $q, Location) {
    // AngularJS will instantiate a singleton by calling "new" on this function    
          
      this.getAllUsers = function ($scope,$rootScope){
        //"http://192.168.21.86:1337/192.168.21.86:5984/opensrp/_design/Privilege/_view/privilege_by_name";
        //var apiURLs = COUCHURL + "/opensrp/_design/User/_view/by_id"; 
        var apiURLs = OPENSRP_WEB_BASE_URL + "/get-all-users-with-role";
        $http.get(apiURLs, { 
          cache: false
        })
        .success(function (data) {
          $rootScope.Users = data;
          $rootScope.loading = false;
          $scope.disabled = false;
        });
      }

      this.getRolesAndUsers = function($scope, $rootScope, $timeout){        
        var userUrl = OPENSRP_WEB_BASE_URL + "/get-all-users";        
        var userRequest = $http.get(userUrl, { cache: false  });


        var roleUrl = OPENSRP_WEB_BASE_URL + "/get-all-roles";
        var roleRequest = $http.get(roleUrl, { cache: false });

        $q.all([userRequest, roleRequest]).then(function(results){         
          var fetchedRoles = results[1].data;
          var fetchedUsers = results[0].data;
          $scope.users = [];
          $scope.formData.parent = {};
          $scope.formData.selectedChildren = [];
          for(var i = 0 ; i < fetchedUsers.length; i++){            
            $scope.users.push({ "user_name" : fetchedUsers[i].user_name, "id" : fetchedUsers[i].id });
            $scope.formData.selectedChildren[fetchedUsers[i].user_name] = false;
          }              

          $scope.roles = [];
          $scope.formData.selectedRoles = [];
          for(var i = 0 ; i < fetchedRoles.length; i++){            
            $scope.roles.push({ "name" : fetchedRoles[i].name, "id" : fetchedRoles[i].id });
            $scope.formData.selectedRoles[fetchedRoles[i].name] = false;
          }          
         
          
          $scope.formData.password="";
          $scope.formData.email = "";

          $scope.ifEdit = false; 
          $rootScope.loading = false;
          $scope.disabled = false;
          $("#password").val();
          $("#email").val();
        });
      }
      this.editUser = function(data,$window,Flash){
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/edit-user";          
        delete data.selectedChildren;
        delete data.selectedRoles;
        delete data.decoyCheckbox;
        
        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
          $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully edit user. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/users';
          }else{
             $("#message").html("<p class='lead'>Failed to edit user</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });  

      }
      this.createUser = function(data,$window,Flash){
        
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/add-user";          
        delete data.selectedChildren;
        delete data.selectedRoles;
        delete data.decoyCheckbox;
        
        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully created a user. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/users';
          }else{
             $("#message").html("<p class='lead'>Failed to create user</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });
      };

      this.initiateLocationAssignment = function($scope,$rootScope,$timeout,id,$q){
          
        $rootScope.loading = true;
        var Userurl = OPENSRP_WEB_BASE_URL + "/get-user-by-name?userName=" + id;        
        var locationInfoUrl = OPENSRP_WEB_BASE_URL + '/get-location-info?locationId=' ;
        $http.get(Userurl, { 
          cache: false,
        })
        .success(function (data) {
          Location.getAllLocationTags($scope,$rootScope);
          
          $scope.currentUser = data;//.rows[0].value;          
          if($scope.currentUser.location && $scope.currentUser.location.length > 0){

            $http.get(locationInfoUrl+ $scope.currentUser.location[0].id, { cache: false})
              .success(function(data){
                
                if($scope.currentUser.location[0].name =="Upazilla"){
                  $scope.selections['Upazilla'] = $scope.currentUser.location[0].id;
                  $scope.selectOptions['Upazilla'] = data.ownSiblings;
                }else if($scope.currentUser.location[0].name=="Union"){
                  $scope.selections['Union'] = $scope.currentUser.location[0].id;
                  $scope.selectOptions['Union'] = data.ownSiblings;
                  $scope.selections['Upazilla'] = data.parentUpazilla.id;
                  $scope.selectOptions['Upazilla'] = data.parentUpazillaSiblings;

                }else{
                  $scope.selections['Ward'] = data.parentWard.id;
                  $scope.selectOptions['Ward'] = data.parentWardSiblings;
                  $scope.selections['Union'] = data.parentUnion.id;
                  $scope.selectOptions['Union'] = data.parentUnionSiblings;
                  $scope.selections['Upazilla'] = data.parentUpazilla.id;
                  $scope.selectOptions['Upazilla'] = data.parentUpazillaSiblings;
                }                
                $scope.selections['District'] = data.parentDistrict.id;
                $scope.selectOptions['District'] = data.parentDistrictSiblings;  

                $scope.selections['Division'] = data.parentDivision.id;
                $scope.selectOptions['Division'] = data.parentDivisionSiblings; 

                $scope.selections['Division'] = data.parentDivision.id;
                $scope.selectOptions['Division'] = data.parentDivisionSiblings; 

                $scope.selectOptions['Unit'] = data.ownSiblings;

                if(data.ownSiblings && data.ownSiblings.length>0) {
                  for(var i = 0 ; i < $scope.currentUser.location.length; i++){
                    $scope.unitSelections[$scope.currentUser.location[i].name] = true;  
                  }
                }
              });
          }else{
            Location.getChildrenLocationsAndAppend($scope, $rootScope, "", "Division");
          }
        });
      }; 

      this.assignLocationToUser = function(data, $window){
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/assign-location-to-user"; 

        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            
            $window.location = '/#/users';
          }else{
            
          }
          
        });
        
      }; 

      this.getUserByName =  function($scope,$rootScope,$timeout,id,$q){
        console.log("User.userByName called.");
        //http://localhost:5984/opensrp/_design/Privilege/_view/privilege_by_id?key=%225da9913d2e051554a772deae8b02aa0b%22
        var url = OPENSRP_WEB_BASE_URL + "/get-user-by-name?userName=" + id; // COUCHURL+'/opensrp/_design/User/_view/by_user_name?key="' + id + '"';  
        var roleUrl = OPENSRP_WEB_BASE_URL + "/get-all-roles"; //COUCHURL + "/opensrp/_design/Role/_view/role_by_name";
        var userUrl =  OPENSRP_WEB_BASE_URL + "/get-all-users";// COUCHURL + "/opensrp/_design/User/_view/by_user_name"; // "/all-user-name";
        $rootScope.loading = true;
        var fetchedRoles = $http.get(roleUrl,{ 
          cache: false
        }); 
        var fetchedUsers = $http.get(userUrl,{ 
          cache: false
        });
        var fetchedCurrentUser = $http.get(url,{ 
          cache: true
        } );

        $q.all([fetchedRoles, fetchedUsers, fetchedCurrentUser]).then(function(results){
          
          $scope.roles = results[0].data;//[];
          $scope.formData.selectedRoles = [];
          for(var i = 0 ; i < $scope.roles.length; i++){
            $scope.formData.selectedRoles[$scope.roles[i].id] = false;
          } 

          $scope.users = results[1].data; //[];
          $scope.formData.parent = {};
          $scope.formData.selectedChildren = [];
          for(var i = 0 ; i < $scope.users.length; i++){
            $scope.formData.selectedChildren[$scope.users[i].user_name] = false;
          }

          $scope.formData.given_name = results[2].data.given_name;
          $scope.formData.middle_name = results[2].data.middle_name;
          $scope.formData.family_name = results[2].data.family_name;
          $scope.formData.contact_number = Number(results[2].data.contact_number);
          $scope.formData.email = results[2].data.email;
          $scope.formData.personal_address = results[2].data.personal_address;
          $scope.formData.user_name = results[2].data.user_name;
          $scope.formData.gender = results[2].data.gender;
          $('select[name="gender"]').val(results[2].data.gender);
          $('select[name="parent"]').val('demosrp');//results[2].data.rows[0].value.parent.user_name);
          $scope.formData.parent={'user_name': results[2].data.parent.user_name, 
            'id':results[2].data.parent.id};
           
          $scope.formData.password = "";

          for(var i = 0 ; i < results[2].data.roles.length; i++){
            $scope.formData.selectedRoles[results[2].data.roles[i].name] = true;
          }
          $("#decoyCheckbox").click();          
         
          if(results[2].data.children){
            for(var i = 0 ; i < results[2].data.children.length; i++){              
              $scope.formData.selectedChildren[results[2].data.children[i].user_name] = true;
            } 
          }
          
          $scope.ifEdit = true;
          $rootScope.loading = false;
        });  
      };     
  });
