
/// <reference path="controllers/home/homecontroller.ts"/>

module USoStupidApp {
    //'use strict';

    //var baseUrl = "/";
    //try {
    //    baseUrl = $("base").first().attr("href"); 
    //} catch (e) {
    //}
    ////alert(1);
    var localWindow :any = window;
    var myapp: ng.IModule = angular.module('USoStupidApp', ['ngRoute', 'ngResource', 'ngAnimate']);
    
    //myapp.service("service", ScafoldServices.Shared.prototype.injection());
    //myapp.service("directive", ScafoldDirectives.Shared.prototype.injection());


    //SERVICES
    myapp.factory("serviceHelperSvc", ["$http", "$location", ($http, $location)
        => new Application.Services.ServiceHelperSvc($http, $location)]);
    myapp.factory("resourceSvc", ["$http", "serviceHelperSvc", ($http, $serviceHelperSvc)
        => new Application.Services.ResourceSvc($http, $serviceHelperSvc)]);
    myapp.factory("dataSvc", ["$http", "serviceHelperSvc", ($http, $serviceHelperSvc)
        => new Application.Services.DataSvc($http, $serviceHelperSvc)]);


    //WIRE UP DIRECTIVES



    //WIRE UP CONTROLLERS
    myapp.controller("HomeCtrl", ["$scope", "resourceSvc","dataSvc", Application.Controllers.HomeCtrl]);






     

    myapp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider : ng.IHttpProvider, $provide : any) {
    //    //$locationProvider.html5Mode(true).hashPrefix('!');
    //    $locationProvider.html5Mode(true);
    //    $routeProvider
    //        .when('/home/', { templateUrl: baseUrl + 'partials/home.html', controller: "unc" })
    //        .otherwise({ redirectTo: baseUrl + 'angularApp/home/home.html', controller: "unc" });

//
        //$httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.defaults.useXDomain = true;
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/Home', { templateUrl: '/angularApp/views/home/Home.html', controller: 'HomeCtrl' })

             
            
            .when('/Error', { templateUrl: '/angularApp/views/shared/Error.html' })
            .otherwise({
                redirectTo: '/Home'
            });

        //$httpProvider.interceptors.push('authorizationInterceptor');
        //$httpProvider.interceptors.push('httpInterceptor');

    }]);
    myapp.factory('userProfileSvc', () => {
        return {};
    });
    



    localWindow.app = myapp;
    localWindow.utilities = angular.module("custom-utilities", []);

    ////myapp.run(() => {

    ////    alert('started');
    ////});
}


