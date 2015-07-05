module Application.Constants {
    export class PubSubConstants {

        NotificationMessageRecieved: string = "NotificationMessageRecieved";

        constructor() {
            
        }

    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.constant("pubSubConstants", new PubSubConstants());
}