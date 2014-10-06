//app.factory('resourceSvc', ['$http', 'serviceHelperSvc', 'userProfileSvc', function ($http, serviceHelper, userProfileSvc) {

//    var Token = serviceHelper.AuthorizationToken;
//    var Account = serviceHelper.Account;

//    var buildFormData = function (formData) {
//        var dataString = '';
//        for (var prop in formData) {
//            if (formData.hasOwnProperty(prop)) {
//                dataString += (prop + '=' + formData[prop] + '&');
//            }
//        }
//        return dataString.slice(0, dataString.length - 1);
//    };

//    return {
//        something: function (param) {
//            return {};
//        }
//    };
//}]);



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