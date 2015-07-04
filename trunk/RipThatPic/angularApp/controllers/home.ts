module Application.Controllers {
    export class HomeCtrl {
        
        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public notificationHub: Application.Services.INotificationHub,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants) {

            this.init();
        }

        private init() {
            
            var __this = this;

            //this.$rootScope.$on("show-serviced",(evt, area) => {
            //    $("#dRequirements").show();
            //    $("#dWizard").show();
            //    this.$rootScope.$broadcast("wizard-step-selected", "step8");
            //});

            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.NotificationMessageRecieved,
                this.NotificationMessageRecieved,
                undefined);

            this.$scope.$on('$destroy', __this.destructor);

            $('#butTestNotifications').click(function () {
                __this.notificationHub.send( Date.now().toString() );
            });

        }

        NotificationMessageRecieved = ( message: any) => {
            var encodedMsg = $('<div />').text(message).html();
            $('#discussion').append('<li>' + encodedMsg + '</li>');
        }
        
        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.NotificationMessageRecieved, __this.NotificationMessageRecieved);
        }
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("HomeCtrl", ["$scope", "$rootScope", "notificationHub", "radioPubSubSvc", "pubSubConstants", HomeCtrl]); 
}