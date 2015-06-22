module Application.Controllers {
    export class ConfigCommentCtrl {
        

        constructor(public $scope: ng.IScope, public $rootScope: any, public serviceHelperSvc: Application.Services.IServiceHelper, public dataSvc: Application.Services.IData) {
            
        }
        
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCommentCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCommentCtrl]);
}