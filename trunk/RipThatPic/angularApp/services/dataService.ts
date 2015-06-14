module Application.Services {

    export interface IData {
        getAll(area: string, successCallback: Function, errorCallback: Function);

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
            var data = this.http.get(this.urlBase + area + '.json?r=' + Math.random()).then(
                function (response) {
                    successCallback({ data: response.data, status: response.status });
                },
                function (response) {
                    errorCallback({ status: response.status, reason: response.statusText });
                });


        }
       
    }
} 