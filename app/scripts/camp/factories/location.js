'use strict';

/**
 * @ngdoc filter
 * @name opensrpSiteApp.filter:search
 * @function
 * @description
 * # search
 * Filter in the opensrpSiteApp.
 */
 
angular.module('opensrpSiteApp')
.factory('myService', function($http,OPENSRP_WEB_BASE_URL) {
  var myService = {
    get: function() {
      var datas = {};
      
      var i=0;
      var length = 4;
      makeCall(i, length, datas);
      
      return datas;
    }
  }
  
  function makeCall(i, length, datas) {
     var apiURLs = OPENSRP_WEB_BASE_URL+"/all-camp";
    if (i < length) {
      $http.get(apiURLs).then(function(resp) {
        datas[i] = resp.data+i;
        ++i;
        makeCall(i, length, datas);
      }); 
    }
  }
  
  return myService;
});