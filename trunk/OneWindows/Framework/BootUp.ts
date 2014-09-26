///<reference path="../scripts/typings/angularjs/angular.d.ts" /> 
///<reference path="../scripts/typings/angularjs/angular-route.d.ts" />



module ModernFxApp {

     
}


var app = angular.module("modernFxApp", ['ngRoute']);
app.controller("unc", ["$scope", UserNotifications.Controller]);
//app.factory("debounce", ["$timeout", debounceFactory]);