module Application.Controllers {
    export class ConfigCtrl {

        constructor(public $scope: ng.IScope, public $rootScope: any) {

            this.init();
        }

        private init() {
            
            var __this = this;




        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", ConfigCtrl]);
}