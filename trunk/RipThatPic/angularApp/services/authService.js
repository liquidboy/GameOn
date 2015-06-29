var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var AuthService = (function () {
            function AuthService($location) {
                this.sessionId = "";
                this.location = $location;
            }
            AuthService.prototype.injection = function () {
                return [
                    function () {
                        return [AuthService];
                    }
                ];
            };
            AuthService.prototype.login = function (username, userpwd) {
                //todo: do actual authentication call, still need to work out what approach to take
                this.sessionId = 'xxxx-xxxx-xxxx-xxxx-xxxx';
                return true;
            };
            return AuthService;
        })();
        Services.AuthService = AuthService;
        var myapp = angular.module('bootstrapApp');
        myapp.service("authSvc", ["$location", function ($location) { return new AuthService($location); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=authService.js.map