
//http://www.slideshare.net/3x14159265/typescript-angularjs-32029652
//http://www.dotnetcurry.com/showarticle.aspx?ID=1016
//http://www.jokecamp.com/blog/resolving-angularjs-paths-in-asp-mvc-spa-iis/
//http://geekswithblogs.net/shaunxu/archive/2014/06/10/host-angularjs-html5mode-in-asp.net-vnext.aspx
//http://stackoverflow.com/questions/12614072/how-do-i-configure-iis-for-url-rewriting-an-angularjs-application-in-html5-mode
//https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode

/// <reference path="controllers/Windows10/windows10controller.ts"/>

module OneWindowsApp {
    //'use strict';

    //var baseUrl = "/";
    //try {
    //    baseUrl = $("base").first().attr("href"); 
    //} catch (e) {
    //}
    ////alert(1);
    var localWindow :any = window;
    var myapp: ng.IModule = angular.module('oneWindowsApp', ['ngRoute', 'ngResource', 'ngAnimate']);
    //myapp.controller("Windows9Ctrl", ["$scope", Windows9Ctrl]);
    //myapp.service("service", ScafoldServices.Shared.prototype.injection());
    //myapp.service("directive", ScafoldDirectives.Shared.prototype.injection());
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
            .when('/Login', { templateUrl: '/angularApp/views/shared/Login.html' })
            .when('/Register', { templateUrl: '/angularApp/views/shared/Register.html' })
            .when('/About', { templateUrl: '/angularApp/views/about/About.html' })
            .when('/Home', { templateUrl: '/angularApp/views/home/Home.html', controller: 'HomeCtrl' })


            .when('/DotNetNative', { templateUrl: '/angularApp/views/DotNetNative/DotNetNative.html', controller: 'DotNetNativeCtrl' })
            .when('/Metro', { templateUrl: '/angularApp/views/Metro/Metro.html', controller: 'MetroCtrl' })
            .when('/ModernDesktop', { templateUrl: '/angularApp/views/ModernDesktop/ModernDesktop.html', controller: 'ModernDesktopCtrl' })
            .when('/OneCore', { templateUrl: '/angularApp/views/OneCore/OneCore.html', controller: 'OneCoreCtrl' })
            .when('/Windows10', { templateUrl: '/angularApp/views/Windows10/Windows10.html', controller: 'Windows10Ctrl' })
            .when('/WindowsStore', { templateUrl: '/angularApp/views/WindowsStore/WindowsStore.html', controller: 'WindowsStoreCtrl' })
            .when('/DirectX12', { templateUrl: '/angularApp/views/DirectX12/DirectX12.html', controller: 'DirectX12Ctrl' })
            .when('/XAML', { templateUrl: '/angularApp/views/XAML/XAML.html', controller: 'XAMLCtrl' })



            .when('/DotNetNative/ShowPost/:postId', { templateUrl: '/angularApp/views/DotNetNative/ShowPost.html', controller: 'DotNetNativePostCtrl' })
            .when('/Metro/ShowPost/:postId', { templateUrl: '/angularApp/views/Metro/ShowPost.html', controller: 'MetroPostCtrl' })
            .when('/ModernDesktop/ShowPost/:postId', { templateUrl: '/angularApp/views/ModernDesktop/ShowPost.html', controller: 'ModernDesktopPostCtrl' })
            .when('/OneCore/ShowPost/:postId', { templateUrl: '/angularApp/views/OneCore/ShowPost.html', controller: 'OneCorePostCtrl' })
            .when('/Windows10/ShowPost/:postId', { templateUrl: '/angularApp/views/Windows10/ShowPost.html', controller: 'Windows10PostCtrl' })
            .when('/WindowsStore/ShowPost/:postId', { templateUrl: '/angularApp/views/WindowsStore/ShowPost.html', controller: 'WindowsStorePostCtrl' })
            .when('/DirectX12/ShowPost/:postId', { templateUrl: '/angularApp/views/DirectX12/ShowPost.html', controller: 'DirectX12PostCtrl' })
            .when('/XAML/ShowPost/:postId', { templateUrl: '/angularApp/views/XAML/ShowPost.html', controller: 'XAMLPostCtrl' })







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



///http://sirarsalih.com/2014/01/28/when-two-forces-meet-angularjs-typescript/
///http://stackoverflow.com/questions/24056458/how-can-i-define-an-angularjs-factory-using-typescript-class-that-has-constructo