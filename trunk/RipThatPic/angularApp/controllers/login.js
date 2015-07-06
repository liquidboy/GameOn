var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var LoginCtrl = (function () {
            function LoginCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location, radioPubSubSvc, pubSubConstants) {
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
                this.IsLoggedIn = false;
                this.AttemptLogin = function () {
                    _this.authService.login(_this.UserName, _this.Password);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.LoginSuccessful, __this.loginSuccessful);
                    _this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.LoginFailed, __this.loginFailed);
                };
                this.loginSuccessful = function (data) {
                    _this.IsLoggedIn = true;
                    _this.LoginEntity = data;
                    _this.$scope.$apply();
                };
                this.loginFailed = function (error) {
                    _this.IsLoggedIn = false;
                    _this.LoginEntity = {};
                };
                var grouping = location.search()["grouping"];
                var name = location.search()["name"];
                if (!authService.IsLoggedIn) {
                    var __this = this;
                    this.$scope.$on('$destroy', __this.destructor);
                    this.radioPubSubSvc.subscribe(this.pubSubConstants.LoginSuccessful, this.loginSuccessful, undefined);
                    this.radioPubSubSvc.subscribe(this.pubSubConstants.LoginFailed, this.loginFailed, undefined);
                }
                else {
                    this.IsLoggedIn = authService.IsLoggedIn;
                    this.LoginEntity = jQuery.extend(true, {}, authService.LoginEntity);
                }
            }
            return LoginCtrl;
        })();
        Controllers.LoginCtrl = LoginCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("LoginCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", "radioPubSubSvc", "pubSubConstants", LoginCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=login.js.map