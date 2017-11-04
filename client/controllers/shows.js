var myApp = angular.module('myApp');

myApp.controller('ShowsController', ['$scope','$http','$location','$routeParams','Show',function($scope,$http,$location,$routeParams,Show){
  $scope.limit= 12;
  $scope.score = 0;

   $scope.alphabet = ['BBC ONE', 'BBC TWO', 'BBC THREE', 'BBC FOUR', 'CBBC', 'CBEEBIES', 'BBC NEWS'];

   $scope.genres = ['Arts Culture and the Media', 'History', 'Science and Nature', 'Childrens', 'Comedy',
           'Crime', 'Drama', 'Fantasy', 'Food', 'Horror', 'News', 'Reality',
           'Romance', 'Sport', 'Talk Show', 'Thriller'];

   $scope.media = ['Video', 'Audio'];

    $scope.shows = Show.query();


    $scope.filterByAlphabet = function(char) {
      $scope.shows = Show.query({service:char});
      console.log('length: ' + $scope.shows.length);
      $scope.headingTitle = char;
      $scope.limit= 12;
      results = $scope.shows.length;
      console.log('queeryed shows: ', $scope.shows);
      console.log(char);
      console.log('length: ' + $scope.shows.length);
    };

    $scope.filterByGenre = function(genre) {
      $scope.shows = Show.query({categories:genre});
      $scope.headingTitle = genre;
      $scope.limit= 12;
      results = $scope.shows.length;
      console.log('queeryed genre: ', $scope.shows);
      console.log(genre);
      console.log($scope.shows.length);
    };

    $scope.filterBySearch = function(search) {
      $scope.shows = Show.query({search:search});
      $scope.headingTitle = search;
      $scope.limit= 12;
    };

    $scope.filterByMedia = function(type) {
      $scope.shows = Show.query({media_type:type});
      $scope.headingTitle = type;
      $scope.limit= 12;
    };

    $scope.$watch('shows.length', function(length) {
          if(length) { // <= first time length is changed from undefined to 0
            console.log('results found' + $scope.shows.length); // <= will log correct length
            $scope.results = $scope.shows.length
          }
    });

    $scope.loadMore = function() {
      $scope.limit = $scope.limit + 12;
      $scope.score = $scope.score + 12;
      console.log("Loading More....", $scope.score);
    }

    $scope.loadAll = function() {
      $scope.limit = $scope.results;
      $scope.score = $scope.results;
      console.log("Loading All....");
    }

}]);
