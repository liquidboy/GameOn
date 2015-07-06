module Application.Services {
    export interface IAuthService{
        sessionId: string;
        login(username: string, userpwd: string);
        IsLoggedIn: boolean;
        LoginEntity: any;
    }

    export class AuthService implements IAuthService{

        IsLoggedIn: boolean = false;
        sessionId: string = "";
        LoginEntity: any;

        public injection(): Array<any> {
            return [
                () => { return [AuthService]; }
            ];
        }
        constructor(
            public $location: ng.ILocationService,
            public dataSvc: Application.Services.IData,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants ){

        }

        login(username: string, userpwd: string) {
            //todo: do actual authentication call, still need to work out what approach to take
            this.sessionId = 'xxxx-xxxx-xxxx-xxxx-xxxx';
            this.dataSvc
                .login(username, userpwd)
                .success((result: any) => {
                    if (result.IsSuccessful) {
                        this.sessionId = result.SessionId;
                        this.LoginEntity = result;
                        this.IsLoggedIn = true;
                        this.radioPubSubSvc.publish(this.pubSubConstants.LoginSuccessful, result)
                    }
                    else {
                        this.IsLoggedIn = false;
                        this.radioPubSubSvc.publish(this.pubSubConstants.LoginFailed, result.LoginErrorMessage)
                    }
                    
                })
                .error((err) => {
                    alert(err.Message);
                    this.IsLoggedIn = false;
                    this.radioPubSubSvc.publish(this.pubSubConstants.LoginFailed, err)
                });
        }

   
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("authSvc", ["$location", "dataSvc", "radioPubSubSvc", "pubSubConstants", AuthService]);
} 