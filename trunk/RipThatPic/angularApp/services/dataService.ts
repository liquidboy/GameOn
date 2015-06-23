﻿module Application.Services {

    export interface IData {
        deleteArea(name: string, grouping: string): ng.IHttpPromise<{}>;
        deleteVideo(name: string, grouping: string): ng.IHttpPromise<{}>;
        deleteImage(name: string, grouping: string): ng.IHttpPromise<{}>;
        deleteAreaByDisplayId(displayid: string): ng.IHttpPromise<{}>;
        deleteVideoByDisplayId(displayid: string): ng.IHttpPromise<{}>;
        deleteImageByDisplayId(displayid: string): ng.IHttpPromise<{}>;
        getAllAreas(): ng.IHttpPromise<{}>;
        getAllVideos(): ng.IHttpPromise<{}>;
        getAllImages(): ng.IHttpPromise<{}>;
        getAllAreasByGrouping(grouping: string): ng.IHttpPromise<{}>;
        getAllVideosByGrouping(grouping: string): ng.IHttpPromise<{}>;
        getAllImagesByGrouping(grouping: string): ng.IHttpPromise<{}>;
        getAreaByDisplayId(displayid: string): ng.IHttpPromise<{}>;
        getVideoByDisplayId(displayid: string): ng.IHttpPromise<{}>;
        getImageByDisplayId(displayid: string): ng.IHttpPromise<{}>;
        saveArea(areaentity: any): ng.IHttpPromise<{}>;
        saveVideo(videoentity: any): ng.IHttpPromise<{}>;
        saveImage(imageentity: any): ng.IHttpPromise<{}>;
        //saveArea(name: string, grouping: string, color: string, longname: string, displayid: string ): ng.IHttpPromise<{}>;

        testCall();
    }
    export interface ISuccessResponse { data: any; status: any }
    export interface IFailureResponse { status: string; reason: string }

    export class DataSvc implements IData {
        http: ng.IHttpService;
        serviceHelper: IServiceHelper;

        urlBase: string = '/api/';

        deleteArea(name: string, grouping: string) { return this.http.delete(this.urlBase + "area?" + "grouping=" + grouping + "&name=" + name); }
        deleteVideo(name: string, grouping: string) { return this.http.delete(this.urlBase + "video?" + "grouping=" + grouping + "&name=" + name); }
        deleteImage(name: string, grouping: string) { return this.http.delete(this.urlBase + "image?" + "grouping=" + grouping + "&name=" + name); }


        deleteAreaByDisplayId(displayid: string) { return this.http.delete(this.urlBase + "area?displayid=" + displayid); }
        deleteVideoByDisplayId(displayid: string) { return this.http.delete(this.urlBase + "video?displayid=" + displayid); }
        deleteImageByDisplayId(displayid: string) { return this.http.delete(this.urlBase + "image?displayid=" + displayid); }


        public injection(): Array<any> {
            return [
                () => { return [DataSvc]; }
            ];
        }
        constructor($http: ng.IHttpService, $serviceHelper: IServiceHelper) {
            this.http = $http;
            this.serviceHelper = $serviceHelper;

        }

        getAreaByDisplayId(displayid: string) { return this.http.get(this.urlBase + "area/" + displayid); }
        getVideoByDisplayId(displayid: string) { return this.http.get(this.urlBase + "video/" + displayid); }
        getImageByDisplayId(displayid: string) { return this.http.get(this.urlBase + "image/" + displayid); }



        getAllAreas() { return this.http.get(this.urlBase + "areas"); }
        getAllVideos() { return this.http.get(this.urlBase + "videos"); }
        getAllImages() { return this.http.get(this.urlBase + "images"); }



        getAllAreasByGrouping(grouping: string) { return this.http.get(this.urlBase + "areas/" + grouping); }
        getAllVideosByGrouping(grouping: string) { return this.http.get(this.urlBase + "videos/" + grouping); }
        getAllImagesByGrouping(grouping: string) { return this.http.get(this.urlBase + "images/" + grouping); }


        saveArea(areaentity: any) { return this.http.post(this.urlBase + "area", areaentity); }
        saveVideo(videoentity: any) { return this.http.post(this.urlBase + "video", videoentity); }
        saveImage(imageentity: any) { return this.http.post(this.urlBase + "image", imageentity); }

        testCall() {
            alert('DataSvc test call');
        }
       
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("dataSvc", ["$http", "serviceHelperSvc", ($http, serviceHelperSvc) => new DataSvc($http, serviceHelperSvc)]);
} 


//example calls
//dataSvc.addArea("xbox", "gaming", "green", "Xbox One")
//    .success(function (val) { alert(val);})
//    .error(function (val) { alert(val);})
//;