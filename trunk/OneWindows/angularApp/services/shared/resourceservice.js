//app.factory('resourceSvc', ['$http', 'serviceHelperSvc', 'userProfileSvc', function ($http, serviceHelper, userProfileSvc) {
var Application;
(function (Application) {
    //    var Token = serviceHelper.AuthorizationToken;
    //    var Account = serviceHelper.Account;
    //    var buildFormData = function (formData) {
    //        var dataString = '';
    //        for (var prop in formData) {
    //            if (formData.hasOwnProperty(prop)) {
    //                dataString += (prop + '=' + formData[prop] + '&');
    //            }
    //        }
    //        return dataString.slice(0, dataString.length - 1);
    //    };
    //    return {
    //        something: function (param) {
    //            return {};
    //        }
    //    };
    //}]);
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
