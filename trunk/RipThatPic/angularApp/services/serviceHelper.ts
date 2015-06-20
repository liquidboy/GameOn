module Application.Services {
    export interface IServiceHelper {
        getAuthorizationToken(successCallback: Function);
    }

    export class ServiceHelperSvc {

        http: ng.IHttpService;
        location: ng.ILocationService;


        public injection(): Array<any> {
            return [
                () => { return [ServiceHelperSvc]; }
            ];
        }
        constructor($http: ng.IHttpService, $location: ng.ILocationService) {
            this.http = $http;
            this.location = $location;

        }

        getAuthorizationToken(successCallback: Function) {
            this.http.get(this.location.absUrl()).success((data, status) => {
                successCallback(data);
            }).error(error => {
                successCallback(error);
            });

        }

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("serviceHelperSvc", ["$http", "$location", ($http, $location) => new ServiceHelperSvc($http, $location)]);
} 