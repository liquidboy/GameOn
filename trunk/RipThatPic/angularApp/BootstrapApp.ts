﻿module BootstrapApp {
    var localWindow: any = window;
    var myapp: ng.IModule = angular.module('bootstrapApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ngSanitize']);
    



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
            .when('/config/install', { controller: 'ConfigInstallCtrl', templateUrl: '/angularApp/views/config/install.html', controllerAs: 'configinstall' })
            .when('/config/image', { controller: 'ConfigImageCtrl', templateUrl: '/angularApp/views/config/image.html', controllerAs: 'configimage' })
            .when('/config/document', { controller: 'ConfigDocumentCtrl', templateUrl: '/angularApp/views/config/document.html', controllerAs: 'configdocument' })
            .when('/config/link', { controller: 'ConfigLinkCtrl', templateUrl: '/angularApp/views/config/link.html', controllerAs: 'configlink' })
            .when('/config/list', { controller: 'ConfigListCtrl', templateUrl: '/angularApp/views/config/list.html', controllerAs: 'configlist' })
            .when('/config/setting', { controller: 'ConfigSettingCtrl', templateUrl: '/angularApp/views/config/setting.html', controllerAs: 'configsetting' })
            .when('/config/page', { controller: 'ConfigPageCtrl', templateUrl: '/angularApp/views/config/page.html', controllerAs: 'configpage' })
            .when('/config/permission', { controller: 'ConfigPermissionCtrl', templateUrl: '/angularApp/views/config/permission.html', controllerAs: 'configpermission' })
            .when('/config/post', { controller: 'ConfigPostCtrl', templateUrl: '/angularApp/views/config/post.html', controllerAs: 'configpost' })
            .when('/config/datacenter', { controller: 'ConfigDatacenterCtrl', templateUrl: '/angularApp/views/config/datacenter.html', controllerAs: 'configdatacenter' })
            .when('/config/map', { controller: 'ConfigMapCtrl', templateUrl: '/angularApp/views/config/map.html', controllerAs: 'configmap' })
            .when('/config/service', { controller: 'ConfigServiceCtrl', templateUrl: '/angularApp/views/config/service.html', controllerAs: 'configservice' })
            .when('/config/extension', { controller: 'ConfigExtensionCtrl', templateUrl: '/angularApp/views/config/extension.html', controllerAs: 'configextension' })
            .when('/config/theme', { controller: 'ConfigThemeCtrl', templateUrl: '/angularApp/views/config/theme.html', controllerAs: 'configtheme' })
            .when('/config/log', { controller: 'ConfigLogCtrl', templateUrl: '/angularApp/views/config/log.html', controllerAs: 'configlog' })
            .when('/config/version', { controller: 'ConfigVersionCtrl', templateUrl: '/angularApp/views/config/version.html', controllerAs: 'configversion' })
            .when('/config/grouping', { controller: 'ConfigGroupingCtrl', templateUrl: '/angularApp/views/config/grouping.html', controllerAs: 'configgrouping' })
            .when('/error', { controller: 'ErrorCtrl',templateUrl: '/angularApp/views/shared/error.html' })
            .otherwise({ redirectTo: '/home'});

    }]);






    localWindow.app = myapp;
    //localWindow.utilities = angular.module("custom-utilities", []);


}