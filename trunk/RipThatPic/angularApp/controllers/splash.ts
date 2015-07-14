module Application.Controllers {
    export class SplashCtrl {


        feedbackElement: JQuery;

        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public location: ng.ILocationService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants) {
            
            this.feedbackElement = $('#loadingLink');
            this.feedbackElement.html("please wait, loading...");

            this.$scope.$on('$destroy', this.destructor);

            radioPubSubSvc.subscribe(pubSubConstants.NotificationHubConnected, this.connectedToNotificationHub, null);
            
        }
        
        connectedToNotificationHub = () => {
            this.feedbackElement.html("connected succesfully...");
            var __this = this;

            setTimeout(() => {

                //http://weblogs.asp.net/dwahlin/cancelling-route-navigation-in-angularjs
                //without the rootscope it fails
                __this.$rootScope.$evalAsync(function () {
                    __this.location.path('/explorer'); 
                }); 

            }, 1000);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.NotificationHubConnected, __this.connectedToNotificationHub);
        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("SplashCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", "radioPubSubSvc", "pubSubConstants", SplashCtrl]);
}