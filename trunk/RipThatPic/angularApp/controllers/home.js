var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, $rootScope, notificationHub, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.notificationHub = notificationHub;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.NotificationMessageRecieved = function (message) {
                    var encodedMsg = $('<div />').text(message).html();
                    $('#discussion').append('<li>' + encodedMsg + '</li>');
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
                $('#sendmessage').click(function () {
                    __this.notificationHub.send($('#displayname').val(), $('#message').val());
                });
            };
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("HomeCtrl", ["$scope", "$rootScope", "notificationHub", "radioPubSubSvc", "pubSubConstants", HomeCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=home.js.map