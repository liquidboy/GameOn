module Application.Services {
    export interface IAuthService{
        sessionId: string;
        login(username: string, userpwd: string);
    }

    export class AuthService implements IAuthService{


        sessionId: string = "";

        public injection(): Array<any> {
            return [
                () => { return [AuthService]; }
            ];
        }
        constructor(
            public $location: ng.ILocationService,
            public dataSvc: Application.Services.IData,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants )
        {

        }

        login(username: string, userpwd: string) {
            //todo: do actual authentication call, still need to work out what approach to take
            this.sessionId = 'xxxx-xxxx-xxxx-xxxx-xxxx';
            this.dataSvc
                .login(username, userpwd)
                .success((result:any) => {
                    this.sessionId = result.SessionId;
                    this.radioPubSubSvc.publish(this.pubSubConstants.LoginSuccessful, result)
                })
                .error((err) => {
                    alert(err.Message);
                    this.radioPubSubSvc.publish(this.pubSubConstants.LoginFailed, err)
                });
        }

   
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("authSvc", ["$location", "dataSvc", "radioPubSubSvc", "pubSubConstants", AuthService]);
} 