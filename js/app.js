angular.module('wikiApp', ['ngAnimate', 'truncate'])
    .controller('wikiCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
        'use strict';

        $scope.title = '';
        $scope.items = [];
        $scope.myVar = '';
        $scope.results = [];
        $scope.one;
        $scope.searchArray = [];
        $scope.number_conversion = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

        $scope.linkOpener = function(link) {
            $window.open(link, '_blank');
        };

        $scope.removeItem = function(index) {
            $scope.items.splice(index, 1);
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
                    angular.forEach(results, function(v, k) {
                        $scope.searchArray.push(page + v.pageid);
                        $scope.results.push({
                            title: v.title,
                            page: page + v.pageid,
                            extract: v.extract,
                            // thumbnail: v.thumbnail.source
                        })
                    })
                })
        }

        $scope.todos = JSON.parse(localStorage.getItem('todos')) || [];

        $scope.addTodo = function() {
            $scope.todos.push({
                'title': $scope.newTodo,
                'done': false
            })
            $scope.newTodo = ''
        };

        $scope.addItems = function() {
            $scope.title = 'cheese';
            $scope.search();
        }

        $scope.clearCompleted = function() {
            $scope.todos = $scope.todos.filter(function(item) {
                return !item.done;
            })
        };

        $scope.$watch('todos', function(newValue, oldValue) {
            if (newValue != oldValue) {
                localStorage.setItem('todos', JSON.stringify(newValue))
            }
        }, true);

        $scope.close = function() {
            $('button.close').trigger('click');
        }
        var calculateFunction = function(month) {
            console.log(month);
        }
        var commands = {
            'search for *val': function(val) {
                $scope.title = val;
                $scope.search();
            },
            'show me *val': function(val) {
                $http({
                    dataType: 'json',
                    url: 'https://www.reddit.com/r/funny/search.json?q=' + String(val) + '&restrict_sr=on&sort=relevance&t=all',
                }).
                success(function(data, status) {
                    console.log('successfully found: ' + data);
                    for (var i = 0; i < data.data.children.length; i++) {}
                }).
                error(function(data, status) {
                    console.log(data || "Request failed. Try again next time, ya dingus!");
                });
            },

            // 'calculate :quarter stats': {'regexp': /^calculate (January|April|July|October) stats$/, 'callback': calculateFunction},

            'open number *val': function(val) {
                if (val == 'one') {
                    val = $scope.number_conversion.indexOf(String(val));
                }
                console.log('link == ' + $scope.searchArray[parseInt(val) - 1]);

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
                // $scope.close();
                $('button.close').trigger('click');
            }

        }

        annyang.addCommands(commands);
        annyang.debug();
        annyang.start();

    }])
