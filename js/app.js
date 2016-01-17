angular.module('wikiApp', ['ngAnimate'])
.controller('wikiCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
    'use strict';
    $scope.title = '';
    $scope.items = [];
    $scope.results = [];
    $scope.searchArray = [];
    $scope.history = [];
    $scope.number_conversion = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    $scope.linkOpener = function(link) {
        $window.open(link, '_blank');
    };

    $scope.getId = function(array, title) {
        console.log(array, title);
        if (!array.some(function(e,i) { return e.title == title })) {
            console.log("Adding");
            $scope.history.push({
                title: title,
            });
        } else {
            console.log("Not adding");
        }
    }

    $scope.searchHistory = function(e) {

        var id = $(e.target).data('id');
        console.log("ID : " + id);
        
        $scope.title = $scope.history[id]['title'];
        console.log("title: " + $scope.title);
        $scope.search();
    };
    $scope.search = function(val) {
        $scope.results = [];
        var api = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
        var cb = '&callback=JSON_CALLBACK';
        var page = 'http://en.wikipedia.org/?curid=';
        $http.jsonp(api + $scope.title + cb)
            .success(function(data) {
                var results = data.query.pages;
                $scope.searchArray = [];
                
                $scope.getId($scope.history, $scope.title);

                angular.forEach(results, function(v, k) { 
                    $scope.searchArray.push(page + v.pageid);
                    $scope.results.push({
                        title: v.title.substring(0,30),
                        page: page + v.pageid,
                        extract: v.extract.substring(0,120),
                    })
                })
            })
    }
    var commands = {
        'search for *val': function(val) {
            $scope.title = val;
            $scope.search();
        },
        'open number *val': function(val) {
            if (val == 'one') {
                val = $scope.number_conversion.indexOf(String(val));
            }

            $scope.linkOpener($scope.searchArray[parseInt(val) - 1])
            $scope.$apply();
        },
        'commands': function() {
            $('#modal-btn').trigger('click');
        },
        'new search': function() {
            $scope.title = '';
            $scope.search();
        },
        'close': function() {
            $('button.close').trigger('click');
        }
    }
    annyang.addCommands(commands);
    annyang.debug();
    annyang.start();
}])