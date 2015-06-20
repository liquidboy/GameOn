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
                    function () {
                        return [DataSvc];
                    }
                ];
            };
            DataSvc.prototype.getAll = function (area, successCallback, errorCallback) {
                var data = this.http.get(this.urlBase + area).then(function (response) {
                    successCallback({ data: response.data, status: response.status });
                }, function (response) {
                    errorCallback({ status: response.status, reason: response.statusText });
                });
            };
            DataSvc.prototype.addArea = function (name, color, longname, successCallback, errorCallback) {
                var postData = { name: name, grouping: "areas", color: color, longName: longname };
                var data = this.http.post(this.urlBase + "areas", postData).then(function (response) {
                    successCallback({ data: response.data, status: response.status });
                }, function (response) {
                    errorCallback({ status: response.status, reason: response.statusText });
                });
            };
            DataSvc.prototype.testCall = function () {
                alert('DataSvc test call');
            };
            return DataSvc;
        })();
        Services.DataSvc = DataSvc;
        var myapp = angular.module('bootstrapApp');
        myapp.service("dataSvc", ["$http", "serviceHelperSvc", function ($http, serviceHelperSvc) { return new DataSvc($http, serviceHelperSvc); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=dataService.js.map