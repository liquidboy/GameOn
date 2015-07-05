module Application.Controllers {
    export class LoginCtrl {


        UserName: string;
        Password: string;
        IsLoggedIn: boolean = false;

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
            
            var grouping: string = location.search()["grouping"];
            var name: string = location.search()["name"];

            var __this = this;
            this.$scope.$on('$destroy', __this.destructor);

            this.radioPubSubSvc.subscribe(this.pubSubConstants.LoginSuccessful, this.loginSuccessful, undefined);
            this.radioPubSubSvc.subscribe(this.pubSubConstants.LoginFailed, this.loginFailed, undefined);
        }
        
        AttemptLogin = () => {
            this.authService.login(this.UserName, this.Password);
        }
        
        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.LoginSuccessful, __this.loginSuccessful);
            this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.LoginFailed, __this.loginFailed);
        }

        loginSuccessful = (data: any) => { this.IsLoggedIn = true;}
        loginFailed = (error: any) => { this.IsLoggedIn = false;}
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("LoginCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", "radioPubSubSvc", "pubSubConstants", LoginCtrl]);
}