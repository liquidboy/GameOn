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
            DataSvc.prototype.deleteArea = function (name, grouping) {
                return this.http.delete(this.urlBase + "area?" + "grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.deleteVideo = function (name, grouping) {
                return this.http.delete(this.urlBase + "video?" + "grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.deleteImage = function (name, grouping) {
                return this.http.delete(this.urlBase + "image?" + "grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.deleteDocument = function (name, grouping) {
                return this.http.delete(this.urlBase + "document?" + "grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.deleteLink = function (name, grouping) {
                return this.http.delete(this.urlBase + "link?" + "grouping=" + grouping + "&name=" + name);
            };
            DataSvc.prototype.deleteAreaByDisplayId = function (displayid) {
                return this.http.delete(this.urlBase + "area?displayid=" + displayid);
            };
            DataSvc.prototype.deleteVideoByDisplayId = function (displayid) {
                return this.http.delete(this.urlBase + "video?displayid=" + displayid);
            };
            DataSvc.prototype.deleteImageByDisplayId = function (displayid) {
                return this.http.delete(this.urlBase + "image?displayid=" + displayid);
            };
            DataSvc.prototype.deleteDocumentByDisplayId = function (displayid) {
                return this.http.delete(this.urlBase + "document?displayid=" + displayid);
            };
            DataSvc.prototype.deleteLinkByDisplayId = function (displayid) {
                return this.http.delete(this.urlBase + "link?displayid=" + displayid);
            };
            DataSvc.prototype.injection = function () {
                return [
                    function () {
                        return [DataSvc];
                    }
                ];
            };
            DataSvc.prototype.getAreaByDisplayId = function (displayid) {
                return this.http.get(this.urlBase + "area/" + displayid);
            };
            DataSvc.prototype.getVideoByDisplayId = function (displayid) {
                return this.http.get(this.urlBase + "video/" + displayid);
            };
            DataSvc.prototype.getImageByDisplayId = function (displayid) {
                return this.http.get(this.urlBase + "image/" + displayid);
            };
            DataSvc.prototype.getDocumentByDisplayId = function (displayid) {
                return this.http.get(this.urlBase + "document/" + displayid);
            };
            DataSvc.prototype.getLinkByDisplayId = function (displayid) {
                return this.http.get(this.urlBase + "link/" + displayid);
            };
            DataSvc.prototype.getAllAreas = function () {
                return this.http.get(this.urlBase + "areas");
            };
            DataSvc.prototype.getAllVideos = function () {
                return this.http.get(this.urlBase + "videos");
            };
            DataSvc.prototype.getAllImages = function () {
                return this.http.get(this.urlBase + "images");
            };
            DataSvc.prototype.getAllDocuments = function () {
                return this.http.get(this.urlBase + "documents");
            };
            DataSvc.prototype.getAllLinks = function () {
                return this.http.get(this.urlBase + "links");
            };
            DataSvc.prototype.getAllAreasByGrouping = function (grouping) {
                return this.http.get(this.urlBase + "areas/" + grouping);
            };
            DataSvc.prototype.getAllVideosByGrouping = function (grouping) {
                return this.http.get(this.urlBase + "videos/" + grouping);
            };
            DataSvc.prototype.getAllImagesByGrouping = function (grouping) {
                return this.http.get(this.urlBase + "images/" + grouping);
            };
            DataSvc.prototype.getAllDocumentsByGrouping = function (grouping) {
                return this.http.get(this.urlBase + "documents/" + grouping);
            };
            DataSvc.prototype.getAllLinksByGrouping = function (grouping) {
                return this.http.get(this.urlBase + "links/" + grouping);
            };
            DataSvc.prototype.saveArea = function (areaentity) {
                return this.http.post(this.urlBase + "area", areaentity);
            };
            DataSvc.prototype.saveVideo = function (videoentity) {
                return this.http.post(this.urlBase + "video", videoentity);
            };
            DataSvc.prototype.saveImage = function (imageentity) {
                return this.http.post(this.urlBase + "image", imageentity);
            };
            DataSvc.prototype.saveDocument = function (documententity) {
                return this.http.post(this.urlBase + "document", documententity);
            };
            DataSvc.prototype.saveLink = function (linkentity) {
                return this.http.post(this.urlBase + "link", linkentity);
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