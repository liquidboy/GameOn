module Application.Constants {
    export class PubSubConstants {

        NotificationMessageRecieved: string = "NotificationMessageRecieved";
        NotificationHubConnected: string = "NotificationHubConnected";

        LoginSuccessful: string = "LoginSuccessful";
        LoginFailed: string = "LoginFailed";


        CookieSettings_FileUploadTimeout: string = "FileUploadTimeout";
        CookieSettings_FileUploadRuntimes: string = "FileUploadRuntimes";
        CookieSettings_FileUploadChunkSize: string = "FileUploadChunkSize";
        CookieSettings_FileUploadRetries: string = "FileUploadRetries";

        constructor() {
            
        }

    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.constant("pubSubConstants", new PubSubConstants());
}