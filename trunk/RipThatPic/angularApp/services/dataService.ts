module Application.Services {

    export interface IData {
        getAll(area: string): ng.IHttpPromise<{}>;
        addArea(name: string, grouping: string, color: string, longname: string): ng.IHttpPromise<{}>;
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

        getAll(area: string) {
            return this.http.get(this.urlBase + area);  //+ '.json?r=' + Math.random()
        }

        addArea(name: string, grouping: string, color: string, longname: string) {
            var postData = { "name": name, "grouping": grouping, "color": color, "longName": longname };
            return this.http.post(this.urlBase + "areas", postData);
        }

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