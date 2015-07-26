module Application.Controllers {

    export class ImageExplorerCtrl {


        constructor(public $scope: ng.IScope, public $rootScope: any, public authSvc: Application.Services.IAuthService) {

            this.init();
        }

        private init() {
            
            var __this = this;

            //this.$rootScope.$on("show-serviced",(evt, area) => {
            //    $("#dRequirements").show();
            //    $("#dWizard").show();

            //    this.$rootScope.$broadcast("wizard-step-selected", "step8");

            //});
            
            __this.authSvc.ping('imageexplorer');
            
        }
        
    }



    export interface IImageExplorerController extends ng.IScope {




        //FileStoragePicker
        IEPList: Array<any>;
        IEPBottom: string;
        IEPTop: string;
        IEPLeft: string;
        IEPRight: string;
        IEPWidth: string;

        
        IEPItemSelected: Function;
        IEPSelectedItem: any;



    }
    



    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ImageExplorerCtrl", ["$scope", "$rootScope", "authSvc", ImageExplorerCtrl]);
}