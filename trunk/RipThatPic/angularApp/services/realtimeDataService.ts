
//http://www.asp.net/signalr/overview/getting-started/tutorial-getting-started-with-signalr
//http://www.asp.net/signalr/overview/deployment/using-signalr-with-azure-web-sites#deploying
//http://www.asp.net/signalr/overview/performance/scaleout-with-redis
//http://www.leggetter.co.uk/2013/12/09/choosing-realtime-web-app-tech-stack.html

//asp.net vNext
//http://davidfowl.com/asp-net-vnext-architecture/


module Application.Services {
    export interface IRealtimeDataService {
        send(message: string);
    }

    export class RealtimeDataService implements IRealtimeDataService{
        jQuery: JQueryStatic;
        $: any = jQuery;
        nh: any;

        constructor(
            public $http: ng.IHttpService,
            public $location: ng.ILocationService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants,
            public authSvc: Application.Services.IAuthService) {
            
            this.nh = this.$.connection.notificationHub;
            this.nh.client.broadcastMessage = this.received;

            this.$.connection.hub.start().done(function () {
                //connection established
            });

        }
        
        send = (message: string) => { this.nh.server.send(this.authSvc.sessionId , message); }
        received = (sessionId: string, message: string) => { this.radioPubSubSvc.publish(this.pubSubConstants.NotificationMessageRecieved, message); }
        ping = () => { this.nh.server.send(this.authSvc.sessionId, 'ping'); }
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("realtimeDataService", ["$http", "$location", "radioPubSubSvc", "pubSubConstants", "authSvc", ($http, $location, radioPubSubSvc, pubSubConstants, authSvc) => new RealtimeDataService($http, $location, radioPubSubSvc, pubSubConstants, authSvc)]);
} 