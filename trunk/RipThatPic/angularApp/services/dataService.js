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
                var data = this.http.get(this.urlBase + area + '.json?r=' + Math.random()).then(function (response) {
                    successCallback({ data: response.data, status: response.status });
                }, function (response) {
                    errorCallback({ status: response.status, reason: response.statusText });
                });
            };
            return DataSvc;
        })();
        Services.DataSvc = DataSvc;
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=dataService.js.map