(function () {
  'use strict';
  angular.module('biblefindWebApp', [
    'biblefindWebApp.webService',
    'ui.select2'
  ]).config([
    '$routeProvider',
    function ($routeProvider) {
      return $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).otherwise({ redirectTo: '/' });
    }
  ]).config([
    '$httpProvider',
    function ($httpProvider) {
      return delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
  ]);
}.call(this));
(function () {
  'use strict';
  var WebService;
  WebService = function () {
    function WebService($http) {
      this.$http = $http;
      this.server = API;
    }
    WebService.prototype.getBooks = function () {
      return this.$http.get(this.server + 'books');
    };
    WebService.prototype.getChapters = function (book) {
      return this.$http.get(this.server + 'chapters/' + book);
    };
    WebService.prototype.getVerses = function (book, chapter) {
      return this.$http.get(this.server + 'verses/' + book + '/' + chapter);
    };
    WebService.prototype.getVerseText = function (book, chapter, verse) {
      return this.$http.get(this.server + 'verse/' + book + '/' + chapter + '/' + verse);
    };
    return WebService;
  }();
  angular.module('biblefindWebApp.webService', [], function ($provide) {
    return $provide.factory('webService', [
      '$http',
      function ($http) {
        return new WebService($http);
      }
    ]);
  });
}.call(this));
(function () {
  'use strict';
  var MainCtrl, __bind = function (fn, me) {
      return function () {
        return fn.apply(me, arguments);
      };
    };
  MainCtrl = function () {
    function MainCtrl($scope, $location, webService) {
      var _this = this;
      this.$scope = $scope;
      this.$location = $location;
      this.webService = webService;
      this.error = __bind(this.error, this);
      this.successVerseText = __bind(this.successVerseText, this);
      this.successVerses = __bind(this.successVerses, this);
      this.successChapter = __bind(this.successChapter, this);
      this.successBook = __bind(this.successBook, this);
      this.clear = __bind(this.clear, this);
      this.prevVerse = __bind(this.prevVerse, this);
      this.nextVerse = __bind(this.nextVerse, this);
      this.getVerseText = __bind(this.getVerseText, this);
      this.getVerses = __bind(this.getVerses, this);
      this.getChapters = __bind(this.getChapters, this);
      this.getBooks = __bind(this.getBooks, this);
      this.$scope.isLoading = false;
      this.getBooks();
      this.$scope.$watch('selectedBook', function (n, o) {
        if (n) {
          return _this.getChapters(n);
        }
      });
      this.$scope.$watch('selectedChapter', function (n, o) {
        if (n) {
          return _this.getVerses(_this.$scope.selectedBook, n);
        }
      });
      this.$scope.$watch('selectedVerse', function (n, o) {
        if (n) {
          return _this.getVerseText(_this.$scope.selectedBook, _this.$scope.selectedChapter, n);
        }
      });
      this.$scope.nextVerse = this.nextVerse;
      this.$scope.prevVerse = this.prevVerse;
    }
    MainCtrl.prototype.getBooks = function () {
      var promise;
      this.$scope.isLoading = true;
      promise = this.webService.getBooks();
      return promise.then(this.successBook, this.error);
    };
    MainCtrl.prototype.getChapters = function (book) {
      var promise;
      this.clear();
      this.$scope.isLoading = true;
      promise = this.webService.getChapters(book);
      return promise.then(this.successChapter, this.error);
    };
    MainCtrl.prototype.getVerses = function (book, chapter) {
      var promise;
      this.clear(2);
      this.$scope.isLoading = true;
      promise = this.webService.getVerses(book, chapter);
      return promise.then(this.successVerses, this.error);
    };
    MainCtrl.prototype.getVerseText = function (book, chapter, verse) {
      var promise;
      this.$scope.isLoading = true;
      promise = this.webService.getVerseText(book, chapter, verse);
      return promise.then(this.successVerseText, this.error);
    };
    MainCtrl.prototype.nextVerse = function () {
      this.$scope.selectedVerse = (parseInt(this.$scope.selectedVerse) + 1).toString();
      return this.getVerseText(this.$scope.selectedBook, this.$scope.selectedChapter, this.$scope.selectedVerse);
    };
    MainCtrl.prototype.prevVerse = function () {
      this.$scope.selectedVerse = (parseInt(this.$scope.selectedVerse) - 1).toString();
      return this.getVerseText(this.$scope.selectedBook, this.$scope.selectedChapter, this.$scope.selectedVerse);
    };
    MainCtrl.prototype.clear = function (level) {
      if (level !== 2) {
        this.$scope.selectedChapter = 1;
      }
      this.$scope.selectedVerse = 1;
      return this.$scope.verseText = '';
    };
    MainCtrl.prototype.successBook = function (data) {
      this.$scope.isLoading = false;
      this.$scope.books = data.data;
      return this.$scope.selectedBook = 'Genesis';
    };
    MainCtrl.prototype.successChapter = function (data) {
      var _i, _ref, _results;
      this.$scope.isLoading = false;
      return this.$scope.chapters = function () {
        _results = [];
        for (var _i = 1, _ref = data.data.size; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
          _results.push(_i);
        }
        return _results;
      }.apply(this);
    };
    MainCtrl.prototype.successVerses = function (data) {
      var _i, _ref, _results;
      this.$scope.isLoading = false;
      return this.$scope.verses = function () {
        _results = [];
        for (var _i = 1, _ref = data.data.size; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
          _results.push(_i);
        }
        return _results;
      }.apply(this);
    };
    MainCtrl.prototype.successVerseText = function (data) {
      this.$scope.isLoading = false;
      return this.$scope.verseText = data.data.verse;
    };
    MainCtrl.prototype.error = function () {
      return console.log(error);
    };
    return MainCtrl;
  }();
  MainCtrl.$inject = [
    '$scope',
    '$location',
    'webService'
  ];
  angular.module('biblefindWebApp').controller('MainCtrl', MainCtrl);
}.call(this));