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
            DataSvc.prototype.getAllAreas = function () {
                return this.http.get(this.urlBase + "areas"); //+ '.json?r=' + Math.random()
            };
            DataSvc.prototype.getAllAreasByGrouping = function (grouping) {
                return this.http.get(this.urlBase + "areas/" + grouping);
            };
            DataSvc.prototype.addArea = function (name, grouping, color, longname) {
                var postData = { "name": name, "grouping": grouping, "color": color, "longName": longname };
                return this.http.post(this.urlBase + "areas", postData);
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