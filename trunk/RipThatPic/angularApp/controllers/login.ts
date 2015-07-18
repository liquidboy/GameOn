module Application.Controllers {
    export class LoginCtrl {


        UserName: string;
        Password: string;
        IsLoggedIn: boolean = false;

        LoggedInEntity: any;

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


            this.init();
        }


        private init() {

            var __this = this;

            if (!__this.authService.IsLoggedIn) {
                __this.$scope.$on('$destroy', __this.destructor);
                __this.radioPubSubSvc.subscribe(__this.pubSubConstants.LoginSuccessful, __this.loginSuccessful, undefined);
                __this.radioPubSubSvc.subscribe(__this.pubSubConstants.LoginFailed, __this.loginFailed, undefined);
            } else {
                __this.IsLoggedIn = __this.authService.IsLoggedIn;
                __this.LoggedInEntity = jQuery.extend(true, {}, __this.authService.LoginEntity);
            }
            
            __this.authService.ping('login');
            
        }

        AttemptLogin = () => {
            this.authService.login(this.UserName, this.Password);
        }
        
        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.LoginSuccessful, __this.loginSuccessful);
            this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.LoginFailed, __this.loginFailed);
        }

        loginSuccessful = (data: any) => { this.IsLoggedIn = true; this.LoggedInEntity = data; this.$scope.$apply();}
        loginFailed = (error: any) => { this.IsLoggedIn = false; this.LoggedInEntity = {};}
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("LoginCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", "radioPubSubSvc", "pubSubConstants", LoginCtrl]);
}