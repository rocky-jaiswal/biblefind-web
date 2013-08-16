'use strict'

angular.module('biblefindWebApp', ["biblefindWebApp.webService", "ui.select2"])
  .config ($routeProvider) ->
    $routeProvider
    .when("/", {templateUrl: "views/main.html", controller: "MainCtrl"})
    .otherwise({redirectTo: "/"})
  .config ($httpProvider) ->
    delete $httpProvider.defaults.headers.common['X-Requested-With']
