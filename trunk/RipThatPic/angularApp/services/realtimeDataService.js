//http://www.asp.net/signalr/overview/getting-started/tutorial-getting-started-with-signalr
//http://www.asp.net/signalr/overview/deployment/using-signalr-with-azure-web-sites#deploying
//http://www.asp.net/signalr/overview/performance/scaleout-with-redis
//http://www.leggetter.co.uk/2013/12/09/choosing-realtime-web-app-tech-stack.html
//asp.net vNext
//http://davidfowl.com/asp-net-vnext-architecture/
var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var RealtimeDataService = (function () {
            function RealtimeDataService($http, $location, radioPubSubSvc, pubSubConstants, authSvc) {
                var _this = this;
                this.$http = $http;
                this.$location = $location;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.authSvc = authSvc;
                this.$ = jQuery;
                this.send = function (message) { _this.nh.server.send(_this.authSvc.sessionId, message); };
                this.received = function (sessionId, message) { _this.radioPubSubSvc.publish(_this.pubSubConstants.NotificationMessageRecieved, message); };
                this.ping = function () { _this.nh.server.send(_this.authSvc.sessionId, 'ping'); };
                this.nh = this.$.connection.notificationHub;
                this.nh.client.broadcastMessage = this.received;
                this.$.connection.hub.start().done(function () {
                    //connection established
                    radioPubSubSvc.publish(pubSubConstants.NotificationHubConnected, undefined);
                });
            }
            return RealtimeDataService;
        }());
        Services.RealtimeDataService = RealtimeDataService;
        var myapp = angular.module('bootstrapApp');
        myapp.service("realtimeDataService", ["$http", "$location", "radioPubSubSvc", "pubSubConstants", "authSvc", function ($http, $location, radioPubSubSvc, pubSubConstants, authSvc) { return new RealtimeDataService($http, $location, radioPubSubSvc, pubSubConstants, authSvc); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=realtimeDataService.js.map