module Application.Constants {
    export class PubSubConstants {

        NotificationMessageRecieved: string = "NotificationMessageRecieved";
        NotificationHubConnected: string = "NotificationHubConnected";

        LoginSuccessful: string = "LoginSuccessful";
        LoginFailed: string = "LoginFailed";

        constructor() {
            
        }

    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.constant("pubSubConstants", new PubSubConstants());
}