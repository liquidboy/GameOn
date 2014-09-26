///<reference path="../scripts/typings/angularjs/angular.d.ts" /> 
///<reference path="../scripts/typings/angularjs/angular-route.d.ts" />



module UserNotifications {
    export interface IScope {
        statusText: string;
    } 

    export class Controller {
        constructor($scope: IScope) {
            $scope.statusText = "Hello from TypeScript + AngularJS";
        }
    }
}
