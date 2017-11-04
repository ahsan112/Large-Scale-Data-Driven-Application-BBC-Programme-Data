var myApp = angular.module('myApp', ['ngRoute','ngResource']);


myApp.config(function($routeProvider,$locationProvider){
  $locationProvider.html5Mode(true);

  $routeProvider.when('/', {
    controller:'ShowsController',
    templateUrl: 'views/shows.html'

  })
  .when('/shows', {
    controller:'ShowsController',
    templateUrl: 'views/shows.html'
  })
  .otherwise({
    redirectTo:'/'
  });
});

myApp.factory('Show', ['$resource', function($resource) {
  return $resource('/api/shows/');
}]);
