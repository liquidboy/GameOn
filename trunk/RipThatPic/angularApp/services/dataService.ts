module Application.Services {

    export interface IData {
        getAll(area: string, successCallback: Function, errorCallback: Function);
        addArea(name: string, color: string, longname: string, successCallback: Function, errorCallback: Function);
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

        getAll(area: string, successCallback: Function, errorCallback: Function) {
            var data = this.http
                .get(this.urlBase + area)  //+ '.json?r=' + Math.random()
                .then(
                    function (response) {
                        successCallback({ data: response.data, status: response.status });
                    },
                    function (response) {
                        errorCallback({ status: response.status, reason: response.statusText });
                });
        }

        addArea(name: string, color: string, longname: string, successCallback: Function, errorCallback: Function) {
            var postData = { name: name, grouping: "areas", color: color, longName: longname};
            var data = this.http
                .post(this.urlBase + "areas", postData)  //+ '.json?r=' + Math.random()
                .then(
                function (response) {
                    successCallback({ data: response.data, status: response.status });
                },
                function (response) {
                    errorCallback({ status: response.status, reason: response.statusText });
                });
        }

        testCall() {
            alert('DataSvc test call');
        }
       
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("dataSvc", ["$http", "serviceHelperSvc", ($http, serviceHelperSvc) => new DataSvc($http, serviceHelperSvc)]);
} 