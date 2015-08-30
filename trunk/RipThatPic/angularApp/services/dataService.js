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
                    function () { return [DataSvc]; }
                ];
            };
            DataSvc.prototype.delete = function (type, name, grouping, sid) { return this.http.delete(this.urlBase + type + "?" + "grouping=" + grouping + "&name=" + name); };
            DataSvc.prototype.deleteByDisplayId = function (type, displayid, sid) { return this.http.delete(this.urlBase + type + "?displayid=" + displayid); };
            DataSvc.prototype.getByDisplayId = function (type, displayid, sid) { return this.http.get(this.urlBase + type + "/" + displayid); };
            DataSvc.prototype.getAll = function (type, sid) { return this.http.get(this.urlBase + type + "s"); };
            DataSvc.prototype.getAllByGrouping = function (type, grouping, sid) { return this.http.get(this.urlBase + type + "s?grouping=" + grouping); };
            DataSvc.prototype.getAllConfig = function (sid) { return this.http.get(this.urlBase + "config"); };
            DataSvc.prototype.getGroupings = function (type, sid) { return this.http.get(this.urlBase + "groupings?tablename=" + type); };
            DataSvc.prototype.get = function (type, grouping, name, sid) { return this.http.get(this.urlBase + type + "?grouping=" + grouping + "&name=" + name); };
            DataSvc.prototype.save = function (type, entity, sid) { return this.http.post(this.urlBase + type, entity); };
            DataSvc.prototype.login = function (username, password) { return this.http.post(this.urlBase + 'login', { "username": username, "password": password }); };
            DataSvc.prototype.ping = function (tid, sid) { return this.http.post(this.urlBase + 'ping', { "ia": true, "ts": new Date().getTime(), "tid": tid, "sid": sid }); };
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
