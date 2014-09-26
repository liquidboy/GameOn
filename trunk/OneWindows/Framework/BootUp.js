var ModernFxApp;
(function (ModernFxApp) {
    'use strict';

    var myapp = angular.module('modernFxApp', ['ngRoute']);
    myapp.controller("unc", ["$scope", UserNotifications.Controller]);
})(ModernFxApp || (ModernFxApp = {}));
//var app = angular.module("modernFxApp", ['ngRoute']);
//app.controller("unc", ["$scope", UserNotifications.Controller]);
////app.factory("debounce", ["$timeout", debounceFactory]);
//# sourceMappingURL=BootUp.js.map
