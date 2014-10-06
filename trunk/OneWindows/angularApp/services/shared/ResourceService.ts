
///http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service
module Application.Services {
    
    export interface  IResource
    {
        something(successCallback: Function);
    }

    export class ResourceSvc {
        http: ng.IHttpService;
        serviceHelper: IServiceHelper;

        public injection(): Array<any> {
            return [
                () => { return [ServiceHelperSvc]; }
            ];
        }
        constructor($http: ng.IHttpService, $serviceHelper: IServiceHelper) {
            this.http = $http;
            this.serviceHelper = $serviceHelper;

        }

        something(successCallback: Function) {
            successCallback({ result: "data returned from resource service"});
        }
    }
}