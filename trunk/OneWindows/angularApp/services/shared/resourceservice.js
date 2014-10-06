var Application;
(function (Application) {
    ///http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
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
    })(Application.Services || (Application.Services = {}));
    var Services = Application.Services;
})(Application || (Application = {}));
//# sourceMappingURL=ResourceService.js.map
