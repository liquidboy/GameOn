var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, $rootScope, realtimeDataService, radioPubSubSvc, pubSubConstants, authSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.realtimeDataService = realtimeDataService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.authSvc = authSvc;
                this.NotificationMessageRecieved = function (message) {
                    var encodedMsg = $('<div />').text(message).html();
                    $('#alerts').append('<li>' + encodedMsg + '</li>'); //i need to clean this up as this "alerts" element sits in index.html
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.NotificationMessageRecieved, __this.NotificationMessageRecieved);
                };
                this.init();
            }
            HomeCtrl.prototype.init = function () {
                var __this = this;
                //this.$rootScope.$on("show-serviced",(evt, area) => {
                //    $("#dRequirements").show();
                //    $("#dWizard").show();
                //    this.$rootScope.$broadcast("wizard-step-selected", "step8");
                //});
                this.radioPubSubSvc.subscribe(this.pubSubConstants.NotificationMessageRecieved, this.NotificationMessageRecieved, undefined);
                this.$scope.$on('$destroy', __this.destructor);
                //dummy call
                $('#butTestNotifications').click(function () {
                    __this.realtimeDataService.send(Date.now().toString());
                });
                __this.authSvc.ping('home');
            };
            return HomeCtrl;
        }());
        Controllers.HomeCtrl = HomeCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("HomeCtrl", ["$scope", "$rootScope", "realtimeDataService", "radioPubSubSvc", "pubSubConstants", "authSvc", HomeCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=home.js.map