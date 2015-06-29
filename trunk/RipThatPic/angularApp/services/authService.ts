module Application.Services {
    export interface IAuthService{
        sessionId: string;
        login(username: string, userpwd: string): boolean;
    }

    export class AuthService implements IAuthService{
        location: ng.ILocationService;

        sessionId: string = "";

        public injection(): Array<any> {
            return [
                () => { return [AuthService]; }
            ];
        }
        constructor($location: ng.ILocationService) {
            this.location = $location;
        }

        login(username: string, userpwd: string) {
            //todo: do actual authentication call, still need to work out what approach to take
            this.sessionId = 'xxxx-xxxx-xxxx-xxxx-xxxx';
            return true;
        }

   
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.service("authSvc", ["$location", ($location) => new AuthService($location)]);
} 