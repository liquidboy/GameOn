///http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var DataSvc = (function () {
            function DataSvc($http, $serviceHelper) {
                this.urlBase = '/api/';
                this.http = $http;
                this.serviceHelper = $serviceHelper;
            }
            DataSvc.prototype.injection = function () {
                return [
                    function () { return [Services.ServiceHelperSvc]; }
                ];
            };
            DataSvc.prototype.getLatestPosts = function (batchSize, area, successCallback) {
                var data = this.http.get(this.urlBase + 'posts/latest/' + area);
                successCallback({ result: "data returned from data service of size " + batchSize });
            };
            return DataSvc;
        })();
        Services.DataSvc = DataSvc;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
