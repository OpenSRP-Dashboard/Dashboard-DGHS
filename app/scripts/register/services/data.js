'use strict';

angular.module('opensrpSiteApp')
   .service('DataService', function ($q, $http, OPENSRP_WEB_BASE_URL, $rootScope) {      
      
      return{
			data: function($scope,data){     
			$scope.sortReverse  = false;
			$scope.currentPage = 1;
			$scope.totalItems = data.length;        
			$scope.entryLimit = 10; // items per page
			console.log($scope.entryLimit);
			$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
		  },
	  }
      
        
    });
