var Application;
(function (Application) {
    var Constants;
    (function (Constants) {
        var PubSubConstants = (function () {
            function PubSubConstants() {
                this.NotificationMessageRecieved = "NotificationMessageRecieved";
                this.NotificationHubConnected = "NotificationHubConnected";
                this.LoginSuccessful = "LoginSuccessful";
                this.LoginFailed = "LoginFailed";
                this.CookieSettings_FileUploadTimeout = "FileUploadTimeout";
                this.CookieSettings_FileUploadRuntimes = "FileUploadRuntimes";
                this.CookieSettings_FileUploadChunkSize = "FileUploadChunkSize";
                this.CookieSettings_FileUploadRetries = "FileUploadRetries";
                this.CookieSettings_FileUploadMaxFileSize = "FileUploadMaxFileSize";
                this.FileUploaded = "FileUploaded";
                this.FileStorageContainerChanged = "FileStorageContainerChanged";
                this.FontChanged = "FontChanged";
                this.FontAdded = "FontAdded";
                this.FontRemoved = "FontRemoved";
            }
            return PubSubConstants;
        })();
        Constants.PubSubConstants = PubSubConstants;
        var myapp = angular.module('bootstrapApp');
        myapp.constant("pubSubConstants", new PubSubConstants());
    })(Constants = Application.Constants || (Application.Constants = {}));
})(Application || (Application = {}));
//# sourceMappingURL=Constants.js.map