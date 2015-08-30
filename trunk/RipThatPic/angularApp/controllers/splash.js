var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var SplashCtrl = (function () {
            function SplashCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.connectedToNotificationHub = function () {
                    _this.feedbackElement.html("connected succesfully...");
                    var __this = _this;
                    setTimeout(function () {
                        //http://weblogs.asp.net/dwahlin/cancelling-route-navigation-in-angularjs
                        //without the rootscope it fails
                        __this.$rootScope.$evalAsync(function () {
                            __this.location.path('/shader');
                        });
                    }, 1000);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.NotificationHubConnected, __this.connectedToNotificationHub);
                };
                this.feedbackElement = $('#loadingLink');
                this.feedbackElement.html("please wait, loading...");
                this.$scope.$on('$destroy', this.destructor);
                radioPubSubSvc.subscribe(pubSubConstants.NotificationHubConnected, this.connectedToNotificationHub, null);
            }
            return SplashCtrl;
        })();
        Controllers.SplashCtrl = SplashCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("SplashCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", "radioPubSubSvc", "pubSubConstants", SplashCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
