module BootstrapApp {
    var localWindow: any = window;
    var myapp: ng.IModule = angular.module('bootstrapApp', ['ngRoute', 'ngResource', 'ngAnimate', 'ngSanitize']);
    
    export var radio: any;


    myapp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider, $httpProvider: ng.IHttpProvider, $provide: any) {

        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$locationProvider.html5Mode(true);

        
        $routeProvider
            .when('/splash', { controller: 'SplashCtrl', templateUrl: '/angularApp/views/splash/splash.html', controllerAs: 'splash' })
            .when('/home', { controller: 'HomeCtrl', templateUrl: '/angularApp/views/home/home.html', controllerAs: 'home' })
            .when('/login', { controller: 'LoginCtrl', templateUrl: '/angularApp/views/login/login.html', controllerAs: 'login' })
            .when('/config', { controller: 'ConfigCtrl', templateUrl: '/angularApp/views/config/config.html', controllerAs: 'config' })
            .when('/explorer', { controller: 'ExplorerCtrl', templateUrl: '/angularApp/views/explorer/explorer.html', controllerAs: 'explorer' })
            .when('/flow', { controller: 'FlowCtrl', templateUrl: '/angularApp/views/flow/flow.html', controllerAs: 'flow' })
            .when('/imageexplorer', { controller: 'ImageExplorerCtrl', templateUrl: '/angularApp/views/explorer/imageexplorer.html', controllerAs: 'explorer' })
            .when('/page', { controller: 'PageCtrl', templateUrl: '/angularApp/views/page/page.html', controllerAs: 'page' })
            .when('/post', { controller: 'PostCtrl', templateUrl: '/angularApp/views/post/post.html', controllerAs: 'post' })
            .when('/config/area', { controller: 'ConfigAreaCtrl', templateUrl: '/angularApp/views/config/area.html', controllerAs: 'configarea' })
            .when('/config/comment', { controller: 'ConfigCommentCtrl', templateUrl: '/angularApp/views/config/comment.html', controllerAs: 'configcomment' })
            .when('/config/session', { controller: 'ConfigSessionCtrl', templateUrl: '/angularApp/views/config/session.html', controllerAs: 'configsession' })
            .when('/config/user', { controller: 'ConfigUserCtrl', templateUrl: '/angularApp/views/config/user.html', controllerAs: 'configuser' })
            .when('/config/audio', { controller: 'ConfigAudioCtrl', templateUrl: '/angularApp/views/config/audio.html', controllerAs: 'configaudio' })
            .when('/config/video', { controller: 'ConfigVideoCtrl', templateUrl: '/angularApp/views/config/video.html', controllerAs: 'configvideo' })
            .when('/config/install', { controller: 'ConfigInstallCtrl', templateUrl: '/angularApp/views/config/install.html', controllerAs: 'configinstall' })
            .when('/config/image', { controller: 'ConfigImageCtrl', templateUrl: '/angularApp/views/config/image.html', controllerAs: 'configimage' })
            .when('/config/filestorage', { controller: 'ConfigFileStorageCtrl', templateUrl: '/angularApp/views/config/filestorage.html', controllerAs: 'configfilestorage' })
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
            .when('/config/editor', { controller: 'ConfigEditorCtrl', templateUrl: '/angularApp/views/config/editor.html', controllerAs: 'configeditor' })
            .when('/config/banner', { controller: 'ConfigBannerCtrl', templateUrl: '/angularApp/views/config/banner.html', controllerAs: 'configbanner' })
            .when('/config/font', { controller: 'ConfigFontCtrl', templateUrl: '/angularApp/views/config/font.html', controllerAs: 'configfont' })
            .when('/error', { controller: 'ErrorCtrl', templateUrl: '/angularApp/views/shared/error.html' })
            .otherwise({ redirectTo: '/splash'});

    }]).run(['$rootScope', 'radioPubSubSvc', 'realtimeDataService', function ($rootScope, radioPubSubSvc, realtimeDataService) { }]);


    
    //localWindow.app = myapp;
    //localWindow['app'] = myapp;
    //myapp['radio'] = radio;

    //localWindow.utilities = angular.module("custom-utilities", []);


} 

//weird way to pass thru the js library "radio" into the module ... find a better approach!!!
eval('BootstrapApp.radio = radio');
eval('BootstrapApp.tinymce = tinymce');




