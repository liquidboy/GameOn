﻿module Application.Controllers {

    export class ExplorerCtrl {


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

            try {
                __this.authSvc.ping('explorer');
            } catch (e) {
                //alert(e.message);
            }

        }
        
    }



    export interface IExplorerController extends ng.IScope {




        //FileStoragePicker
        FSPList: Array<any>;
        FSPBottom: string;
        FSPTop: string;
        FSPLeft: string;
        FSPRight: string;
        FSPWidth: string;

        
        FSPItemSelected: Function;
        FSPSelectedItem: any;


        //FileStorage
        FSItemsList: Array<any>;
        FSBottom: string;
        FSTop: string;
        FSLeft: string;
        FSRight: string;
        FSItemHeight: string;
        FSCN: string;

        FSItemSelected: Function;
        FSSelectedItems: Array<any>;

        FSIsMultipleSelection: boolean;

    }
    



    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ExplorerCtrl", ["$scope", "$rootScope", "authSvc", ExplorerCtrl]);
}