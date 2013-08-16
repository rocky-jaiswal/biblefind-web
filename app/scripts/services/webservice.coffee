"use strict"

class WebService

  constructor: (@$http) ->
    @server = API

  getBooks: ->
    @$http.get(@server + "books")

  getChapters: (book) ->
    @$http.get(@server + "chapters/" + book)

  getVerses: (book, chapter) ->
    @$http.get(@server + "verses/" + book + "/" + chapter)

  getVerseText: (book, chapter, verse) ->
    @$http.get(@server + "verse/" + book + "/" + chapter + "/" + verse)

angular.module "biblefindWebApp.webService", [], ($provide) ->
  $provide.factory "webService", ["$http", ($http) -> new WebService($http)]
