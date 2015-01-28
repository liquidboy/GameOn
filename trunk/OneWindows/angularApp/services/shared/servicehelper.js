//app.factory('serviceHelperSvc', ['$http', '$resource', function ($http, $resource) {
//    var baseUrl = config.apiurl;
//    var buildUrl = function (resourceUrl) {
//        return baseUrl + resourceUrl;
//    };
//    var addRequestHeader = function (key, value) {
//    };
//    return {
//        AuthorizationToken: $resource(buildUrl("Token"), null,
//        {
//            requestToken: { method: 'POST', headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//        }),
//        Account: $resource(buildUrl('api/Account/'), null,
//            {
//                register: { method: 'post' },
//                logOff: { method: 'put' }
//            }),
//        Resource: $resource(buildUrl('api/Resources/:resourceId'),
//            { resourceId: '@Id' },
//            {
//                'update': { method: 'PUT' },
//                getPagedItems: { url: buildUrl("api/Resources?count=:count&page=:page&sortField=:sortField&sortOrder=:sortOrder"), method: 'GET', params: { count: '@count', page: '@page', sortField: '@sortField', sortOrder: '@sortOrder' } }
//            }),
//        Location: $resource(buildUrl('api/Locations/:locationId'), { locationId: '@Id' }, { 'update': { method: 'PUT' } }),
//        ResourceActivity: $resource(buildUrl('api/Resources/:resourceId/Activities/:activityId'),
//                { resourceId: '@ResourceId', activityId: '@Id' })
//    };
//}]);
///http://sirarsalih.com/2014/01/28/when-two-forces-meet-angularjs-typescript/
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
                    function () {
                        return [ServiceHelperSvc];
                    }
                ];
            };
            ServiceHelperSvc.prototype.getAuthorizationToken = function (successCallback) {
                this.http.get(this.location.absUrl()).success(function (data, status) {
                    successCallback(data);
                }).error(function (error) {
                    successCallback(error);
                });
            };
            return ServiceHelperSvc;
        })();
        Services.ServiceHelperSvc = ServiceHelperSvc;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=ServiceHelper.js.map