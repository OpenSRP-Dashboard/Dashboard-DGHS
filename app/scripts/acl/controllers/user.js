'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:AccesstokensCtrl
 * @description
 * # AccesstokensCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
  .controller('UserCtrl', function ($scope,$rootScope,Flash,$window,$timeout,$location,$routeParams,$http,User,AclService, OPENSRP_WEB_BASE_URL,$q,Base64, Location) {   
    
    $scope.can = AclService.can;
    var userName = $routeParams.name; 
    $scope.userRoleCheck = function(roles){
      var boolean =false;
      angular.forEach(roles, function(value, key){
         if(value.name == "Admin"){
            boolean = true;
            return boolean;
         }else{
            boolean = false;
         }
      });
      return boolean; 
    }  
    if ($location.path() == '/add-user') {
      $rootScope.loading = true;      
      $scope.formData = {};      
      User.getRolesAndUsers($scope, $rootScope, $timeout);     

      $scope.save = function(){
        console.log("form submitted");
        console.log($scope.formData);
        $scope.formData.children = [];
        $scope.formData.roles = [];

        for(var i =0; i<$scope.users.length; i++){
          if($scope.formData.selectedChildren[$scope.users[i].name]){
            $scope.formData.children.push({"user_name" : $scope.users[i].name, "id" : $scope.users[i].id});
          }
        }

        for(var i =0; i<$scope.roles.length; i++){
          if($scope.formData.selectedRoles[$scope.roles[i].name]){
            $scope.formData.roles.push({"name" : $scope.roles[i].name, "id" : $scope.roles[i].id});
          }
        }
        
        User.createUser($scope.formData,$window,Flash);
      }     
    }
    else if($location.path().indexOf('/location') > 0){
      $scope.userName = userName;      
      $scope.selections = {};
      $scope.selectOptions = {};    
      $scope.unitSelections = {};        
      $scope.textboxReached = false;
      $scope.reachedTagIndex = 0;
      $scope.locationAssignment = true;
      
      $scope.unitNames = ['1-KA', '1-KHA', '2-KA', '2-KHA', '3-KA', '3-KHA', '4-KA', '4-KHA'];
      for(var i = 0 ; i < $scope.unitNames.length; i++){
        $scope.unitSelections[$scope.unitNames[i]] = false;  
      }

      User.initiateLocationAssignment($scope,$rootScope,$timeout,userName,$q);      
     
      $scope.loadChildSelect = function(nameOfSelectedTag){
      
        var childTagName;
        for(var i =0; i<$scope.sortedTags.length; i++){
          if($scope.sortedTags[i].name === nameOfSelectedTag){
            childTagName = $scope.sortedTags[i+1].name;
            $scope.reachedTagIndex = i;
          }
        }

        
        for(var i = $scope.reachedTagIndex + 1; i<$scope.sortedTags.length; i++){
          $scope.selections[$scope.sortedTags[i].name] = '';
          $scope.selectOptions[$scope.sortedTags[i].name] = '';  
        }

        Location.getChildrenLocationsAndAppend($scope, $rootScope, $scope.selections[nameOfSelectedTag], childTagName); 
        
      }


      $scope.save = function(){
        console.log('assigning locaiton to user.');
        console.log($scope.locationName);
        console.log($scope.unitSelections);
        var finalData = { "user_name" : $scope.userName}
        var finalLocation = [];

        for(var i = 0; i < $scope.selectOptions['Unit'].length; i++){
          if($scope.unitSelections[$scope.selectOptions['Unit'][i].name]){
            finalLocation.push({ "name" : $scope.selectOptions['Unit'][i].name, "id" : $scope.selectOptions['Unit'][i].id});
          }
        }

        finalData.location = finalLocation;

        if($scope.selectOptions['Unit'].length ==0){
          if($scope.selections['Union'] ==""){
            console.log(2222222222222);
            finalLocation.push({ "name" : "Upazilla", "id" : $scope.selections['Upazilla']});
          }else{
            finalLocation.push({ "name" : "Union", "id" : $scope.selections['Union']});
          }
          
        }
finalData.location = finalLocation;
console.log(finalData);
       User.assignLocationToUser(finalData, $window);

      }
    }
    else if(userName){
      $rootScope.loading = true;      

      $scope.save = function(){
        console.log("form submitted");
        console.log($scope.formData);
        $scope.formData.children = [];
        $scope.formData.roles = [];

        for(var i =0; i<$scope.users.length; i++){
          if($scope.formData.selectedChildren[$scope.users[i].user_name]){
            $scope.formData.children.push({"user_name" : $scope.users[i].user_name, "id" : $scope.users[i].id});
          }
        }

        for(var i =0; i<$scope.roles.length; i++){
          if($scope.formData.selectedRoles[$scope.roles[i].name]){
            $scope.formData.roles.push({"name" : $scope.roles[i].name, "id" : $scope.roles[i].id});
          }
        }
        
        console.log($scope.formData);
        User.editUser($scope.formData,$window,Flash);
      }

      $scope.formData = {};
      User.getUserByName($scope,$rootScope,$timeout,userName,$q);
    }
    else{
      $rootScope.loading = true;
      $scope.userAssign =
      ' <a href="#/add-user">'+
      '<i class="glyphicon glyphicon-list-alt"></i>'+
      ' <span>Add User</span>'+
      '</a>';
      User.getAllUsers($scope,$rootScope);
    }

    $scope.ifOneElementOfBooleanArrayIsTrue = function (object) {
      return Object.keys(object).some(function (key) {
        //console.log("called for key -" + key);
        return object[key];
      });
    };
    
    $scope.roleCheckboxClicked = function (toggleThis) {
      $scope.formData.selectedRoles[toggleThis] = ! $scope.formData.selectedRoles[toggleThis];
      console.log($scope.formData.selectedRoles);
      if($scope.ifOneElementOfBooleanArrayIsTrue($scope.formData.selectedRoles)){
        console.log("at least one role is selected");
        if(!$("#decoyCheckbox").is(':checked')){
          $("#decoyCheckbox").click();
        }
      }
      else{
        console.log("no role is selected");
        if($("#decoyCheckbox").is(':checked')){
          $("#decoyCheckbox").click();
        }
      }
    };
     
  });

angular.module('opensrpSiteApp').directive('usernameAvailable', function($q, $http,OPENSRP_WEB_BASE_URL) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attr, model) { 
      model.$asyncValidators.usernameExists = function(modelValue, viewValue) { 
        /*console.log("modelValue " + modelValue + " -- viewValue " + + viewValue)
        console.log(elm);
        console.log(attr);
        console.log("attr.ngDisabled " + attr.ngDisabled + " --- attr.disabled " + attr.disabled);
        console.log(model);
        console.log("inside asyncValidator directive with username- " + model.$viewValue);*/

        var url = OPENSRP_WEB_BASE_URL + "/valid-username?userName=" + model.$viewValue;
        scope.addUser.user_name.$setValidity("usernameAlreadyTaken", true);
        return $http.get(url).success(function (data) {          
          attr.$observe('disabled', function(value){
            console.log("if the elem with usernameAvailable is disabled " + value);
            if(value){
              model.$setValidity('usernameExists', true); 
            }
            else{
              console.log("received response- " + data);   
              if(data == "1"){
                model.$setValidity('usernameExists  ', true); 
                console.log("inside valid userName");  
              }
              else{
                console.log("inside username already taken section");
                scope.addUser.user_name.$setValidity("usernameAlreadyTaken", false);
              }      
            }
          });   
          
        });   
      };
    }
  } 
});

  