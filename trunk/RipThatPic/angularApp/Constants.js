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
            }
            return PubSubConstants;
        })();
        Constants.PubSubConstants = PubSubConstants;
        var myapp = angular.module('bootstrapApp');
        myapp.constant("pubSubConstants", new PubSubConstants());
    })(Constants = Application.Constants || (Application.Constants = {}));
})(Application || (Application = {}));
//# sourceMappingURL=Constants.js.map