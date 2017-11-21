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
                this.IsLoggedIn = false;
                this.sessionId = "xxxx-xxxx-xxxx-xxxx-xxxx";
            }
            AuthService.prototype.injection = function () {
                return [
                    function () { return [AuthService]; }
                ];
            };
            AuthService.prototype.ping = function (tid) {
                this.dataSvc
                    .ping(tid, this.sessionId)
                    .success(function (result) {
                    var r = result;
                })
                    .error(function (err) {
                    alert(err.message);
                });
            };
            AuthService.prototype.login = function (username, userpwd) {
                var _this = this;
                //todo: do actual authentication call, still need to work out what approach to take
                this.dataSvc
                    .login(username, userpwd)
                    .success(function (result) {
                    if (result.IsSuccessful) {
                        _this.sessionId = result.SessionId;
                        _this.LoginEntity = result;
                        _this.IsLoggedIn = true;
                        _this.radioPubSubSvc.publish(_this.pubSubConstants.LoginSuccessful, result);
                    }
                    else {
                        _this.IsLoggedIn = false;
                        _this.radioPubSubSvc.publish(_this.pubSubConstants.LoginFailed, result.LoginErrorMessage);
                    }
                })
                    .error(function (err) {
                    alert(err.Message);
                    _this.IsLoggedIn = false;
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.LoginFailed, err);
                });
            };
            return AuthService;
        }());
        Services.AuthService = AuthService;
        var myapp = angular.module('bootstrapApp');
        myapp.service("authSvc", ["$location", "dataSvc", "radioPubSubSvc", "pubSubConstants", AuthService]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=authService.js.map