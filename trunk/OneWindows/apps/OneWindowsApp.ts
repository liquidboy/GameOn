

module OneWindowsApp {
    'use strict';
      
    var myapp: ng.IModule = angular.module('oneWindowsApp', ['ngRoute']);
    myapp.controller("unc", ["$scope", UserNotifications.Controller]);
    myapp.service("service", ScafoldServices.Shared.prototype.injection());
    myapp.service("directive", ScafoldDirectives.Shared.prototype.injection());
    myapp.config(['$routeProvider', function($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
            .when('/home', {templateUrl:'partials/home.html'})
            .otherwise({ redirectTo: '/home' });
    }]);

}


//var app = angular.module("modernFxApp", ['ngRoute']);
//app.controller("unc", ["$scope", UserNotifications.Controller]);
////app.factory("debounce", ["$timeout", debounceFactory]);