'use strict';

/**
 * @ngdoc overview
 * @name expressAngularAppApp
 * @description
 * # expressAngularAppApp
 *
 * Main module of the application.
 */
angular
  
  .module('opensrpSiteApp', ['ngBootstrap','ngAnimate','ngCookies','ngResource','ngRoute','angular-momentjs','ngSanitize','ngTouch','ui.bootstrap','ngDialog','angular-mapbox','nvd3','chart.js','checklist-model','mm.acl','flash', 'ngMessages','angularUtils.directives.dirPagination'])
  .constant('OPENSRP_WEB_BASE_URL', 'http://192.168.22.55:1234/192.168.22.55:9979')  
  .constant("COUCHURL",'http://192.168.22.55:1234/192.168.22.55:5984')
  .config(['AclServiceProvider', function (AclServiceProvider) {
    var myConfig = {
      storage: 'localStorage',  // sessionStorage
      storageKey: 'AppAcl'
    };
    AclServiceProvider.config(myConfig);
  }])
  .config(['AclServiceProvider', function (AclServiceProvider) {
    AclServiceProvider.resume();
  }])
  .config(['$httpProvider', function ($httpProvider) {           
      $httpProvider.defaults.cache = true;
  }])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/anotherRoute', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
        
      })
  })
  
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/household/list', {
        templateUrl: 'views/register/household_list.html',
        controller: 'HouseholdController',
        controllerAs: 'HC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
.config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/household/search', {
        templateUrl: 'views/register/household_search.html',
        controller: 'HouseholdController',
        controllerAs: 'HC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
.config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/household/details/:id', {
        templateUrl: 'views/register/household_details.html',
        controller: 'HouseholdController',
        controllerAs: 'HC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/household/member/:id', {
        templateUrl: 'views/register/household_member_list.html',
        controller: 'HouseholdController',
        controllerAs: 'HC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
.config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/member/search/:type', {
        templateUrl: 'views/register/member_search.html',
        controller: 'MemberController',
        controllerAs: 'WC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
.config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/member/details/:id', {
        templateUrl: 'views/register/member_details.html',
        controller: 'MemberController',
        controllerAs: 'WC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
  
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/member/list/:type', {
        templateUrl: 'views/register/member_list.html',
        controller: 'MemberController',
        controllerAs: 'WC' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })  
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/camp/search', {
        templateUrl: 'views/camp/search.html',
        controller: 'CampCtrl',
        controllerAs: 'camp' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/camp/list', {
        templateUrl: 'views/camp/index.html',
        controller: 'CampCtrl',
        controllerAs: 'camp' ,
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Camp List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }

      })
  })
  
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/camp/add', {
        templateUrl: 'views/camp/camp_add_edit.html',
        controller: 'CampCtrl',
        controllerAs: 'camp' ,
         resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add Camp')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }       
      })
  })
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/camp/edit/:id', {
        templateUrl: 'views/camp/camp_add_edit.html',
        controller: 'CampCtrl',
        controllerAs: 'camp',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Edit Camp')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }       
      })
  })
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/camp/view/:camp_id/:date/:status', {
        templateUrl: 'views/camp/view.html',
        controller: 'CampCtrl',
        controllerAs: 'camp' ,
         resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('View Camp')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }      
      })
  })
  
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/acl/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'        
      })
      .when('/add-role', {
        templateUrl: 'views/acl/role.html',
        controller: 'RoleCtrl',
        controllerAs: 'role',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add Role')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })      
      .when('/roles', {
        templateUrl: 'views/acl/roles.html',
        controller: 'RoleCtrl',
        controllerAs: 'role',
        resolve : {
          'userData':function(Role){ return Role.promise;},
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Role List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/role/:roleId', {
        templateUrl: 'views/acl/role-edit.html',
        controller: 'RoleCtrl',
        controllerAs: 'role',
       resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Role Edit')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/add-user', {
        templateUrl: 'views/acl/user_add_edit.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add User')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/users', {
        templateUrl: 'views/acl/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('User List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/user/:name', {
        templateUrl: 'views/acl/user_add_edit.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Edit User')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/user/:name/location', {
        templateUrl: 'views/acl/user_location.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('User Location Assign')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/privileges', {
        templateUrl: 'views/acl/privileges.html',
        controller: 'PrivilegeCtrl',
        controllerAs: 'PrivilegeCtrl',
        resolve : {
          //'userData':function(privilegeService){ return privilegeService.promise;},
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Privilege List')){
              // Has proper permissions
              //console.log('is it true?' + AclService.can('Elco Details'));
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
              //return true;
            
            }
          }]
        }        
      })
      .when('/add-privilege', {
        templateUrl: 'views/acl/privilege_add.html',
        controller: 'PrivilegeCtrl',
        controllerAs: 'PrivilegeCtrl',
        resolve : {
          //'userData':function(testService){ return testService.promise;},
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add Privilege')){
              // Has proper permissions
              //console.log('is it true?' + AclService.can('Elco Details'));
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }        
      })
      .when('/privileges/:id', {
        templateUrl: 'views/acl/privilege_edit.html',
        controller: 'PrivilegeCtrl',
        controllerAs: 'PrivilegeCtrl',
        resolve : {          
          'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('Edit Privilege')){
            // Has proper permissions
            //console.log('is it true?' + AclService.can('Elco Details'));
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          
          }
          }]
        }
      })
      .when('/locations', {
        templateUrl: 'views/acl/locations.html',
        controller: 'LocationCtrl',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Location List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/locations/:id', {
        templateUrl: 'views/acl/location_add_edit.html',
        controller: 'LocationCtrl',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Edit Location')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/locations/add', {
        templateUrl: 'views/acl/location_add_edit.html',
        controller: 'LocationCtrl',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add Location')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/sampleRegister', {
        templateUrl: 'views/register/register.html',
        controller: 'RegisterCtrl'    
      })
      .when('/sampleExport', {
        templateUrl: 'views/export/export.html',
        controller: 'ExportCtrl'
      })
      .when('/login', {
        templateUrl: 'views/acl/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        templateUrl: 'views/acl/login.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
       .when('/un-authorized', {
        templateUrl: 'views/acl/unauthorized.html',
        controller: 'UnauthorizedCtrl',
        controllerAs: 'unauthorized',        
      })
      .otherwise({
        redirectTo: '/'
      });
      //$locationProvider.html5Mode(true);
  })  
  .run(function ($rootScope, $location, $window, $timeout,AclService, Authentication, $http,$q,Base64,OPENSRP_WEB_BASE_URL) {
    'use strict';

    $rootScope.$on('$routeChangeError', function (current, previous, rejection) {        
      $location.path('/un-authorized');    
    });

    $rootScope.$on('$locationChangeStart', function (current, previous, rejection) {
      if (!Authentication.isAuthenticated()) {
            //evt.preventDefault();           
        $location.path('/login');
        if (!$rootScope.$$phase) {
            //this will kickstart angular if to notice the change

            //$$phase is a flag set while angular is in a $digest cycle.
            //Sometimes (in rare cases), you want to check $$phase on the 
            //scope before doing an $apply. An error occurs if you try to $apply during a $digest:
            $rootScope.$apply();
        }
        else {
            $window.location = '/#/login';
        }
        delete $http.defaults.headers.common['X-Requested-With'];
        delete $http.defaults.headers.common.Authorization;
      }  
    });  
  });
/*_.mixin(_.str.exports());*/
