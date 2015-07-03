module Application.Services {

    export interface IData {
        
        delete(type: string, name: string, grouping: string, sessionid: string): ng.IHttpPromise<{}>;
        
        deleteByDisplayId(type: string, displayid: string, sessionid: string): ng.IHttpPromise<{}>;
        
        getAll(type: string, sessionid: string): ng.IHttpPromise<{}>;
        getAllConfig(sessionid: string): ng.IHttpPromise<{}>;
        getAllByGrouping(type: string, grouping: string, sessionid: string): ng.IHttpPromise<{}>;        
        getByDisplayId(type: string, displayid: string, sessionid: string): ng.IHttpPromise<{}>;

        getGroupings(type: string, sessionid: string): ng.IHttpPromise<{}>;
        get(type: string, grouping: string, name: string, sessionid: string): ng.IHttpPromise<{}>;


        save(type: string, entity: any, sessionid: string): ng.IHttpPromise<{}>;
        //saveArea(name: string, grouping: string, color: string, longname: string, displayid: string ): ng.IHttpPromise<{}>;

        testCall();
    }
    export interface ISuccessResponse { data: any; status: any }
    export interface IFailureResponse { status: string; reason: string }

    export class DataSvc implements IData {
        http: ng.IHttpService;
        serviceHelper: IServiceHelper;

        urlBase: string = '/api/';
        
        
        public injection(): Array<any> {
            return [
                () => { return [DataSvc]; }
            ];
        }
        constructor($http: ng.IHttpService, $serviceHelper: IServiceHelper) {
            this.http = $http;
            this.serviceHelper = $serviceHelper;

        }


        delete(type: string, name: string, grouping: string, sessionid: string) { return this.http.delete(this.urlBase + type + "?" + "grouping=" + grouping + "&name=" + name); }
        deleteByDisplayId(type: string, displayid: string, sessionid: string) { return this.http.delete(this.urlBase + type + "?displayid=" + displayid); }


        getByDisplayId(type: string, displayid: string, sessionid: string) { return this.http.get(this.urlBase + type + "/" + displayid); }
        getAll(type: string, sessionid: string) { return this.http.get(this.urlBase + type + "s"); }
        getAllByGrouping(type: string, grouping: string, sessionid: string) { return this.http.get(this.urlBase + type + "s?grouping=" + grouping); }
        getAllConfig(sessionid: string) { return this.http.get(this.urlBase + "config"); }

        getGroupings(type: string, sessionid: string) { return this.http.get(this.urlBase + "groupings?tablename=" + type); }
        get(type: string, grouping: string, name: string, sessionid: string) { return this.http.get(this.urlBase + type + "?grouping=" + grouping + "&name=" + name);}

        save(type: string, entity: any, sessionid: string) { return this.http.post(this.urlBase + type , entity); }




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