module Application.Controllers {
    export class ConfigSessionCtrl {
        

        constructor(public $scope: ng.IScope, public $rootScope: any, public serviceHelperSvc: Application.Services.IServiceHelper, public dataSvc: Application.Services.IData) {
            
        }
        
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigSessionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigSessionCtrl]);
}