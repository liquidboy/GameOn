var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var NotificationHub = (function () {
            function NotificationHub($http, $location, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$http = $http;
                this.$location = $location;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.$ = jQuery;
                this.send = function (sessionId, message) {
                    _this.chat.server.send(sessionId, message);
                };
                this.received = function (sessionId, message) {
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.NotificationMessageRecieved, message);
                };
                this.chat = this.$.connection.notificationHub;
                this.chat.client.broadcastMessage = this.received;
                this.$.connection.hub.start().done(function () {
                    //connection established
                });
            }
            return NotificationHub;
        })();
        Services.NotificationHub = NotificationHub;
        var myapp = angular.module('bootstrapApp');
        myapp.service("notificationHub", ["$http", "$location", "radioPubSubSvc", "pubSubConstants", function ($http, $location, radioPubSubSvc, pubSubConstants) { return new NotificationHub($http, $location, radioPubSubSvc, pubSubConstants); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=notificationHub.js.map