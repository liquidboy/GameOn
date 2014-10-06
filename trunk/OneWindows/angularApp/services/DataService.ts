
///http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
module Application.Services {

    export interface IData {
        getLatestPosts(batchSize: number, area: string, successCallback: Function);
    }
     
    export class DataSvc {
        http: ng.IHttpService;
        serviceHelper: IServiceHelper;

        urlBase : string = '/api/';

        public injection(): Array<any> {
            return [
                () => { return [ServiceHelperSvc]; }
            ];
        }
        constructor($http: ng.IHttpService, $serviceHelper: IServiceHelper) {
            this.http = $http;
            this.serviceHelper = $serviceHelper;

        }

        getLatestPosts(batchSize: number, area: string, successCallback: Function) {
            var data = this.http.get(this.urlBase + 'posts/latest/' + area);
            successCallback({ result: "data returned from data service of size " + batchSize});
        }
    }
} 