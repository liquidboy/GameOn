
module Application.Services {
    export interface INotificationHub {
        send(message: string);
    }

    export class NotificationHub implements INotificationHub{
        jQuery: JQueryStatic;
        $: any = jQuery;
        chat: any;

        constructor(public $http: ng.IHttpService, public $location: ng.ILocationService, public radioPubSubSvc: Application.Services.IRadioPubSubSvc, public pubSubConstants: Application.Constants.PubSubConstants, public authSvc: Application.Services.IAuthService ) {
            
            this.chat = this.$.connection.notificationHub;
            this.chat.client.broadcastMessage = this.received;

            this.$.connection.hub.start().done(function () {
                //connection established
            });

        }
        
        send = (message: string) => { this.chat.server.send(this.authSvc.sessionId , message); }
        received = (sessionId: string, message: string) => { this.radioPubSubSvc.publish(this.pubSubConstants.NotificationMessageRecieved, message); }
        ping = () => { this.chat.server.send(this.authSvc.sessionId, 'ping'); }
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("notificationHub", ["$http", "$location", "radioPubSubSvc", "pubSubConstants", "authSvc", ($http, $location, radioPubSubSvc, pubSubConstants, authSvc) => new NotificationHub($http, $location, radioPubSubSvc, pubSubConstants, authSvc)]);
} 