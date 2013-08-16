"use strict"

class MainCtrl

  constructor: (@$scope, @$location, @webService) ->
    @$scope.isLoading = false
    @getBooks()
    
    @$scope.$watch "selectedBook", (n, o) => @getChapters(n) if n
    @$scope.$watch "selectedChapter", (n, o) => @getVerses(@$scope.selectedBook, n) if n
    @$scope.$watch "selectedVerse", (n, o) => @getVerseText(@$scope.selectedBook, @$scope.selectedChapter, n) if n
    
    @$scope.nextVerse = @nextVerse
    @$scope.prevVerse = @prevVerse

  getBooks: =>
    @$scope.isLoading = true
    promise = @webService.getBooks()
    promise.then @successBook, @error

  getChapters: (book) =>
    @clear()
    @$scope.isLoading = true
    promise = @webService.getChapters(book)
    promise.then @successChapter, @error

  getVerses: (book, chapter) =>
    @clear(2)
    @$scope.isLoading = true
    promise = @webService.getVerses(book, chapter)
    promise.then @successVerses, @error

  getVerseText: (book, chapter, verse) =>
    @$scope.isLoading = true
    promise = @webService.getVerseText(book, chapter, verse)
    promise.then @successVerseText, @error

  nextVerse: () =>
    @$scope.selectedVerse = (parseInt(@$scope.selectedVerse) + 1).toString()
    @getVerseText(@$scope.selectedBook, @$scope.selectedChapter, @$scope.selectedVerse)

  prevVerse: () =>
    @$scope.selectedVerse = (parseInt(@$scope.selectedVerse) - 1).toString()
    @getVerseText(@$scope.selectedBook, @$scope.selectedChapter, @$scope.selectedVerse)

  clear: (level) =>
    @$scope.selectedChapter = 1 unless level is 2
    @$scope.selectedVerse = 1
    @$scope.verseText = ""

  successBook: (data) =>
    @$scope.isLoading = false
    @$scope.books = data.data
    @$scope.selectedBook = "Genesis"

  successChapter: (data) =>
    @$scope.isLoading = false
    @$scope.chapters = [1..data.data.size]

  successVerses: (data) =>
    @$scope.isLoading = false
    @$scope.verses = [1..data.data.size]

  successVerseText: (data) =>
    @$scope.isLoading = false
    @$scope.verseText = data.data.verse

  error: () =>
    console.log error

MainCtrl.$inject = ["$scope", "$location", "webService"]
angular.module("biblefindWebApp").controller "MainCtrl", MainCtrl