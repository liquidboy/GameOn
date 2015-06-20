module Application.Controllers {
    export class ConfigCtrl {

        constructor(public $scope: ng.IScope, public $rootScope: any, public serviceHelperSvc: Application.Services.IServiceHelper, public dataSvc: Application.Services.IData) {

            this.init();
        }

        private init() {
            
            var __this = this;




        }

        testclick = () => {
            //this.serviceHelperSvc.testCall();
            this.dataSvc.getAll("areas",
                function (result) { alert(result.data);},
                function (result) { alert('failure');});
        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
}