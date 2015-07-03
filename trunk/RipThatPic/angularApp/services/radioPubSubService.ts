module Application.Services {
    export interface IRadioPubSubSvc {
        publish(topic: string, message: any);
        subscribe(topic: string, handler: Function);
        ubsubscribe(topic: string, handler: Function);
    }

    export class RadioPubSubSvc {

        http: ng.IHttpService;
        location: ng.ILocationService;


        public injection(): Array<any> {
            return [
                () => { return [RadioPubSubSvc]; }
            ];
        }
        constructor($http: ng.IHttpService, $location: ng.ILocationService) {
            this.http = $http;
            this.location = $location;

        }

       
        publish = function (topic: string, message: any) {

        }
        subscribe = function (topic: string, handler: Function) {

        }
        ubsubscribe = function (topic: string, handler: Function) {

        }
       

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("radioPubSubSvc", ["$http", "$location", ($http, $location) => new RadioPubSubSvc($http, $location)]);
} 