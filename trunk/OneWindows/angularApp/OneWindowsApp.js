//http://www.slideshare.net/3x14159265/typescript-angularjs-32029652
//http://www.dotnetcurry.com/showarticle.aspx?ID=1016
//http://www.jokecamp.com/blog/resolving-angularjs-paths-in-asp-mvc-spa-iis/
//http://geekswithblogs.net/shaunxu/archive/2014/06/10/host-angularjs-html5mode-in-asp.net-vnext.aspx
//http://stackoverflow.com/questions/12614072/how-do-i-configure-iis-for-url-rewriting-an-angularjs-application-in-html5-mode
//https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode
var OneWindowsApp;
(function (OneWindowsApp) {
    //'use strict';
    //var baseUrl = "/";
    //try {
    //    baseUrl = $("base").first().attr("href");
    //} catch (e) {
    //}
    ////alert(1);
    var localWindow = window;
    var myapp = angular.module('oneWindowsApp', ['ngRoute', 'ngResource', 'ngAnimate']);

    //myapp.controller("unc", ["$scope", UserNotifications.Controller]);
    //myapp.service("service", ScafoldServices.Shared.prototype.injection());
    //myapp.service("directive", ScafoldDirectives.Shared.prototype.injection());
    myapp.config([
        '$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider, $locationProvider, $httpProvider, $provide) {
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
            $routeProvider.when('/Login', { templateUrl: '/angularApp/views/shared/Login.html' }).when('/Register', { templateUrl: '/angularApp/views/shared/Register.html' }).when('/About', { templateUrl: '/angularApp/views/about/About.html' }).when('/Home', { templateUrl: '/angularApp/views/home/Home.html', controller: 'HomeCtrl' }).when('/DotNetNative', { templateUrl: '/angularApp/views/DotNetNative/DotNetNative.html', controller: 'DotNetNativeCtrl' }).when('/Metro', { templateUrl: '/angularApp/views/Metro/Metro.html', controller: 'MetroCtrl' }).when('/ModernDesktop', { templateUrl: '/angularApp/views/ModernDesktop/ModernDesktop.html', controller: 'ModernDesktopCtrl' }).when('/OneCore', { templateUrl: '/angularApp/views/OneCore/OneCore.html', controller: 'OneCoreCtrl' }).when('/Windows9', { templateUrl: '/angularApp/views/Windows9/Windows9.html', controller: 'Windows9Ctrl' }).when('/WindowsStore', { templateUrl: '/angularApp/views/WindowsStore/WindowsStore.html', controller: 'WindowsStoreCtrl' }).when('/DirectX12', { templateUrl: '/angularApp/views/DirectX12/DirectX12.html', controller: 'DirectX12Ctrl' }).when('/XAML', { templateUrl: '/angularApp/views/XAML/XAML.html', controller: 'XAMLCtrl' }).when('/Error', { templateUrl: '/angularApp/views/shared/Error.html' }).otherwise({
                redirectTo: '/Home'
            });
            //$httpProvider.interceptors.push('authorizationInterceptor');
            //$httpProvider.interceptors.push('httpInterceptor');
        }]);
    myapp.factory('userProfileSvc', function () {
        return {};
    });

    localWindow.app = myapp;
    localWindow.utilities = angular.module("custom-utilities", []);
})(OneWindowsApp || (OneWindowsApp = {}));
//# sourceMappingURL=OneWindowsApp.js.map
