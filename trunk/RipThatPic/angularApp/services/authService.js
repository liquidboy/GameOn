var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var AuthService = (function () {
            function AuthService($location, dataSvc, radioPubSubSvc, pubSubConstants) {
                this.$location = $location;
                this.dataSvc = dataSvc;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.sessionId = "";
            }
            AuthService.prototype.injection = function () {
                return [
                    function () {
                        return [AuthService];
                    }
                ];
            };
            AuthService.prototype.login = function (username, userpwd) {
                var _this = this;
                //todo: do actual authentication call, still need to work out what approach to take
                this.sessionId = 'xxxx-xxxx-xxxx-xxxx-xxxx';
                this.dataSvc.login(username, userpwd).success(function (result) {
                    _this.sessionId = result.SessionId;
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.LoginSuccessful, result);
                }).error(function (err) {
                    alert(err.Message);
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.LoginFailed, err);
                });
            };
            return AuthService;
        })();
        Services.AuthService = AuthService;
        var myapp = angular.module('bootstrapApp');
        myapp.service("authSvc", ["$location", "dataSvc", "radioPubSubSvc", "pubSubConstants", AuthService]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=authService.js.map