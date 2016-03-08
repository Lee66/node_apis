/*
 *  https://github.com/jiahut/ng.lodash
 *  zhijia,.zhang jiahut@gmail.com
 *
*/

// var app = ng.module('app', ["ng.lodash"])
//   // use in views, ng-repeat="x in _.range(3)"
//   .run(function ($rootScope, _) {
//      $rootScope._ = _;
//   });

(function (ng, _) {
  'use strict';

  var lodashModule = ng.module('ng.lodash', []);
  
  lodashModule.factory('_', ['$window', function($window) {
    // place lodash include before angular
    return $window._;
  }]);

}(angular, _));
