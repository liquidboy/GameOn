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
            DataSvc.prototype.delete = function (type, name, grouping, sessionid) {
                return this.http.delete(this.urlBase + type + "?" + "grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.deleteByDisplayId = function (type, displayid, sessionid) {
                return this.http.delete(this.urlBase + type + "?displayid=" + displayid);
            };
            DataSvc.prototype.getByDisplayId = function (type, displayid, sessionid) {
                return this.http.get(this.urlBase + type + "/" + displayid);
            };
            DataSvc.prototype.getAll = function (type, sessionid) {
                return this.http.get(this.urlBase + type + "s");
            };
            DataSvc.prototype.getAllByGrouping = function (type, grouping, sessionid) {
                return this.http.get(this.urlBase + type + "s?grouping=" + grouping);
            };
            DataSvc.prototype.getAllConfig = function (sessionid) {
                return this.http.get(this.urlBase + "config");
            };
            DataSvc.prototype.getGroupings = function (type, sessionid) {
                return this.http.get(this.urlBase + "groupings?tablename=" + type);
            };
            DataSvc.prototype.get = function (type, grouping, name, sessionid) {
                return this.http.get(this.urlBase + type + "?grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.save = function (type, entity, sessionid) {
                return this.http.post(this.urlBase + type, entity);
            };
            DataSvc.prototype.login = function (username, password) {
                return this.http.post(this.urlBase + 'login', { "username": username, "password": password });
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
//example calls
//dataSvc.addArea("xbox", "gaming", "green", "Xbox One")
//    .success(function (val) { alert(val);})
//    .error(function (val) { alert(val);})
//; 
//# sourceMappingURL=dataService.js.map