var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var NotificationHub = (function () {
            function NotificationHub($http, $location, radioPubSubSvc, pubSubConstants, authSvc) {
                var _this = this;
                this.$http = $http;
                this.$location = $location;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.authSvc = authSvc;
                this.$ = jQuery;
                this.send = function (message) {
                    _this.chat.server.send(_this.authSvc.sessionId, message);
                };
                this.received = function (sessionId, message) {
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.NotificationMessageRecieved, message);
                };
                this.ping = function () {
                    _this.chat.server.send(_this.authSvc.sessionId, 'ping');
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
        myapp.service("notificationHub", ["$http", "$location", "radioPubSubSvc", "pubSubConstants", "authSvc", function ($http, $location, radioPubSubSvc, pubSubConstants, authSvc) { return new NotificationHub($http, $location, radioPubSubSvc, pubSubConstants, authSvc); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=notificationHub.js.map