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


            //this.dataSvc.getAllAreas()
            //    .success(function (result: any) {
            //        //alert(result[0].PartitionKey);
            //    })
            //    .error(function (err) { });
            
            //this.dataSvc.addArea("xbox", "gaming", "green", "Xbox One")
            //    .success(function (val) { alert(val);})
            //    .error(function (val) { alert(val);})
            //;

            //this.dataSvc.getAllAreasByGrouping("gaming")
            //    .success(function (result: any) {
            //        alert(result.length);
            //    })
            //    .error(function (err) { });
        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
}