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
                this.loginSuccessful = function (data) { _this.IsLoggedIn = true; _this.LoggedInEntity = data; _this.$scope.$apply(); };
                this.loginFailed = function (error) { _this.IsLoggedIn = false; _this.LoggedInEntity = {}; };
                var grouping = location.search()["grouping"];
                var name = location.search()["name"];
                this.init();
            }
            LoginCtrl.prototype.init = function () {
                var __this = this;
                if (!__this.authService.IsLoggedIn) {
                    __this.$scope.$on('$destroy', __this.destructor);
                    __this.radioPubSubSvc.subscribe(__this.pubSubConstants.LoginSuccessful, __this.loginSuccessful, undefined);
                    __this.radioPubSubSvc.subscribe(__this.pubSubConstants.LoginFailed, __this.loginFailed, undefined);
                }
                else {
                    __this.IsLoggedIn = __this.authService.IsLoggedIn;
                    __this.LoggedInEntity = jQuery.extend(true, {}, __this.authService.LoginEntity);
                }
                __this.authService.ping('login');
            };
            return LoginCtrl;
        })();
        Controllers.LoginCtrl = LoginCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("LoginCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", "radioPubSubSvc", "pubSubConstants", LoginCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=login.js.map