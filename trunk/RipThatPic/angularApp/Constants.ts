﻿module Application.Constants {
    export class PubSubConstants {

        MessageSample001: string = "Message1";
        MessageSample002: string = "Message2";

        NotificationMessageRecieved: string = "NotificationMessageRecieved";

        constructor() {
            
        }

    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.constant("pubSubConstants", new PubSubConstants());
}