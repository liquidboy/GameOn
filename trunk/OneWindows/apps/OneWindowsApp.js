//http://www.slideshare.net/3x14159265/typescript-angularjs-32029652
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
//# sourceMappingURL=OneWindowsApp.js.map
