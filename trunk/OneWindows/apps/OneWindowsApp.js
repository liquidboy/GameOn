var OneWindowsApp;
(function (OneWindowsApp) {
    'use strict';

    var myapp = angular.module('oneWindowsApp', ['ngRoute']);
    myapp.controller("unc", ["$scope", UserNotifications.Controller]);
    myapp.service("service", ScafoldServices.Shared.prototype.injection());
    myapp.service("directive", ScafoldDirectives.Shared.prototype.injection());
    myapp.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.when('/home', { templateUrl: 'partials/home.html' }).otherwise({ redirectTo: '/home' });
        }]);
})(OneWindowsApp || (OneWindowsApp = {}));
//var app = angular.module("modernFxApp", ['ngRoute']);
//app.controller("unc", ["$scope", UserNotifications.Controller]);
////app.factory("debounce", ["$timeout", debounceFactory]);
//# sourceMappingURL=OneWindowsApp.js.map
