var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var ServiceHelperSvc = (function () {
            function ServiceHelperSvc($http, $location) {
                this.http = $http;
                this.location = $location;
            }
            ServiceHelperSvc.prototype.injection = function () {
                return [
                    function () { return [ServiceHelperSvc]; }
                ];
            };
            ServiceHelperSvc.prototype.getAuthorizationToken = function (successCallback) {
                this.http.get(this.location.absUrl()).success(function (data, status) {
                    successCallback(data);
                }).error(function (error) {
                    successCallback(error);
                });
            };
            ServiceHelperSvc.prototype.testCall = function () {
                alert('servicehelpersvc test call');
            };
            return ServiceHelperSvc;
        })();
        Services.ServiceHelperSvc = ServiceHelperSvc;
        var myapp = angular.module('bootstrapApp');
        myapp.service("serviceHelperSvc", ["$http", "$location", function ($http, $location) { return new ServiceHelperSvc($http, $location); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=serviceHelper.js.map