
module Application.Services {
    export interface INotificationHub {
        send(sessionId: string, message: string);
    }

    export class NotificationHub implements INotificationHub{
        jQuery: JQueryStatic;
        $: any = jQuery;
        chat: any;

        constructor(public $http: ng.IHttpService, public $location: ng.ILocationService, public radioPubSubSvc: Application.Services.IRadioPubSubSvc, public pubSubConstants: Application.Constants.PubSubConstants ) {
            
            this.chat = this.$.connection.notificationHub;
            this.chat.client.broadcastMessage = this.received;

            this.$.connection.hub.start().done(function () {
                //connection established
            });

        }
        
        send = (sessionId: string, message: string) => {
            this.chat.server.send(sessionId, message);
        }

        received = (sessionId: string, message: string) => {
            this.radioPubSubSvc.publish(this.pubSubConstants.NotificationMessageRecieved, message);
        }
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("notificationHub", ["$http", "$location", "radioPubSubSvc", "pubSubConstants", ($http, $location, radioPubSubSvc, pubSubConstants) => new NotificationHub($http, $location, radioPubSubSvc, pubSubConstants)]);
} 