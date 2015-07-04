module Application.Services {
    export interface IRadioPubSubSvc {
        publish(topic: string, message: any);
        subscribe(topic: string, handler: Function, scope: any);
        unsubscribe(topic: string, handler: Function);
    }

    export class RadioPubSubSvc {

        http: ng.IHttpService;
        location: ng.ILocationService;
        _radio: any;
        _refCount: number = 0;

        //public injection(): Array<any> {
        //    return [
        //        () => { return [RadioPubSubSvc]; }
        //    ];
        //}

        constructor($http: ng.IHttpService, $location: ng.ILocationService) {
            this.http = $http;
            this.location = $location;
            var localWindow: any = window;

            //radio is injected in the app in the bootstrapapp
            this._radio = localWindow['radio'];
        }
        
       
        publish = (topic: string, message: any) => {
            this._radio(topic).broadcast(message);
        }

        subscribe = (topic: string, handler: Function, scope: any) => {
            this._refCount++;
            this._radio(topic).subscribe(handler);
            // if we have a scope then unsubscribe the handler
            // when the scope is destroyed
            var __this = this;
            if (scope && scope.$on) {
                scope.$on('$destroy', function () {
                    __this.unsubscribe(topic, handler);
                });
            }
        }

        unsubscribe = (topic: string, handler: Function) => {
            this._refCount--;
            this._radio(topic).unsubscribe(handler);
        }
       

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("radioPubSubSvc", ["$http", "$location", RadioPubSubSvc]); //($http, $location) => new RadioPubSubSvc($http, $location)]);
} 