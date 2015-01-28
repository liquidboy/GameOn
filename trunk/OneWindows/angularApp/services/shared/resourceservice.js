///http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var ResourceSvc = (function () {
            function ResourceSvc($http, $serviceHelper) {
                this.http = $http;
                this.serviceHelper = $serviceHelper;
            }
            ResourceSvc.prototype.injection = function () {
                return [
                    function () {
                        return [Services.ServiceHelperSvc];
                    }
                ];
            };
            ResourceSvc.prototype.something = function (successCallback) {
                successCallback({ result: "data returned from resource service" });
            };
            return ResourceSvc;
        })();
        Services.ResourceSvc = ResourceSvc;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=ResourceService.js.map