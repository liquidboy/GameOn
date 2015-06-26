module Application.Services {

    export interface IData {
        
        delete(type: string, name: string, grouping: string): ng.IHttpPromise<{}>;
        
        deleteByDisplayId(type: string, displayid: string): ng.IHttpPromise<{}>;
        
        getAll(type: string): ng.IHttpPromise<{}>;
        getAllByGrouping(type:string, grouping: string): ng.IHttpPromise<{}>;        
        getByDisplayId(type: string, displayid: string): ng.IHttpPromise<{}>;

        getGroupings(tablename: string): ng.IHttpPromise<{}>;


        save(type: string, entity: any): ng.IHttpPromise<{}>;
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


        delete(type: string, name: string, grouping: string) { return this.http.delete(this.urlBase + type + "?" + "grouping=" + grouping + "&name=" + name); }
        deleteByDisplayId(type: string, displayid: string) { return this.http.delete(this.urlBase + type + "?displayid=" + displayid); }


        getByDisplayId(type: string, displayid: string) { return this.http.get(this.urlBase + type + "/" + displayid); }
        getAll(type: string) { return this.http.get(this.urlBase + type + "s"); }
        getAllByGrouping(type: string, grouping: string) { return this.http.get(this.urlBase + type + "s/" + grouping); }

        getGroupings(tablename: string) { return this.http.get(this.urlBase + "groupings?tablename=" + tablename); }


        save(type: string, entity: any) { return this.http.post(this.urlBase + type , entity); }




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