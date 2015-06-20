var BootstrapApp;
(function (BootstrapApp) {
    var localWindow = window;
    var myapp = angular.module('bootstrapApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ngSanitize']);
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
    myapp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider, $locationProvider, $httpProvider, $provide) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$locationProvider.html5Mode(true);
        $routeProvider.when('/home', { controller: 'HomeCtrl', templateUrl: '/angularApp/views/home/home.html' }).when('/error', { controller: 'ErrorCtrl', templateUrl: '/angularApp/views/shared/error.html' }).otherwise({ redirectTo: '/home' });
    }]);
    localWindow.app = myapp;
})(BootstrapApp || (BootstrapApp = {}));
//# sourceMappingURL=BootstrapApp.js.map