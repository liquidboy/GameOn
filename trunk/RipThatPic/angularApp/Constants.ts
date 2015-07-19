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
        CookieSettings_FileUploadMaxFileSize: string = "FileUploadMaxFileSize";

        FileUploaded: string = "FileUploaded";

        FileStorageContainerChanged: string = "FileStorageContainerChanged";
        FileStorageListSelectionsChanged: string = "FileStorageListSelectionsChanged";

        FontChanged: string = "FontChanged";
        ClearFontsSelected: string = "ClearFontsSelected";
        InitFontsSelected: string = "InitFontsSelected";

        constructor() {
            
        }

    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.constant("pubSubConstants", new PubSubConstants());
}