
//http://www.slideshare.net/3x14159265/typescript-angularjs-32029652
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

