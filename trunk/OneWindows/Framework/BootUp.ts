

module ModernFxApp {
    'use strict';

    var myapp: ng.IModule = angular.module('modernFxApp', ['ngRoute']);
    myapp.controller("unc", ["$scope", UserNotifications.Controller]);


}


//var app = angular.module("modernFxApp", ['ngRoute']);
//app.controller("unc", ["$scope", UserNotifications.Controller]);
////app.factory("debounce", ["$timeout", debounceFactory]);