﻿module BootstrapApp {
    var localWindow: any = window;
    var myapp: ng.IModule = angular.module('bootstrapApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ngSanitize']);
    

    //SERVICES
    //myapp.factory("serviceHelperSvc", ["$http", "$location", ($http, $location)
    //    => new Application.Services.ServiceHelperSvc($http, $location)]);
    //myapp.service("dataSvc", ["$http", "serviceHelperSvc", ($http, serviceHelperSvc)
    //    => new Application.Services.DataSvc($http, serviceHelperSvc)]);


    //DIRECTIVES
    //myapp.directive("dBillboard", Application.Directives.BillboardDirective.prototype.injection());
    //myapp.directive("dWorkarea", Application.Directives.WorkareaDirective.prototype.injection());


    //CONTROLLERS
    //myapp.controller("HomeCtrl", ["$scope", "$rootScope", Application.Controllers.HomeCtrl]);


    myapp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider, $provide: any) {

        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$locationProvider.html5Mode(true);

        
        $routeProvider
            .when('/home', { controller: 'HomeCtrl', templateUrl: '/angularApp/views/home/home.html', controllerAs: 'home'})
            .when('/config', { controller: 'ConfigCtrl', templateUrl: '/angularApp/views/config/config.html', controllerAs: 'config' })
            .when('/config/area', { controller: 'ConfigAreaCtrl', templateUrl: '/angularApp/views/config/area.html', controllerAs: 'configarea' })
            .when('/config/comment', { controller: 'ConfigCommentCtrl', templateUrl: '/angularApp/views/config/comment.html', controllerAs: 'configcomment' })
            .when('/config/session', { controller: 'ConfigSessionCtrl', templateUrl: '/angularApp/views/config/session.html', controllerAs: 'configsession' })
            .when('/config/user', { controller: 'ConfigUserCtrl', templateUrl: '/angularApp/views/config/user.html', controllerAs: 'configuser' })
            .when('/config/video', { controller: 'ConfigVideoCtrl', templateUrl: '/angularApp/views/config/video.html', controllerAs: 'configvideo' })
            .when('/config/image', { controller: 'ConfigImageCtrl', templateUrl: '/angularApp/views/config/image.html', controllerAs: 'configimage' })
            .when('/config/document', { controller: 'ConfigDocumentCtrl', templateUrl: '/angularApp/views/config/document.html', controllerAs: 'configdocument' })
            .when('/config/link', { controller: 'ConfigLinkCtrl', templateUrl: '/angularApp/views/config/link.html', controllerAs: 'configlink' })
            .when('/config/setting', { controller: 'ConfigSettingCtrl', templateUrl: '/angularApp/views/config/setting.html', controllerAs: 'configsetting' })
            .when('/error', { controller: 'ErrorCtrl',templateUrl: '/angularApp/views/shared/error.html' })
            .otherwise({ redirectTo: '/home'});

    }]);



    localWindow.app = myapp;
    //localWindow.utilities = angular.module("custom-utilities", []);


}