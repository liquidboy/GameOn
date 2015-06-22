module Application.Controllers {
    export class ConfigVideoCtrl {
        

        constructor(public $scope: ng.IScope, public $rootScope: any, public serviceHelperSvc: Application.Services.IServiceHelper, public dataSvc: Application.Services.IData) {
            
        }
        
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigVideoCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigVideoCtrl]);
}