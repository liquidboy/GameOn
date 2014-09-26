module ModernFx {
    export interface IScope {
        statusText: string;
    } 
     
    export class BootUp {
        constructor($scope: IScope) {
            $scope.statusText = "Hello from TypeScript + AngularJS";
        }
    }
}