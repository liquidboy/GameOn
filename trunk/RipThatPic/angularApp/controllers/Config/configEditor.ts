module Application.Controllers {
    export class ConfigEditorCtrl {
        localWindow: any = window;


        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService) {

            //try {
                this.init();
            //} catch (e) { }

        }

      
        

        private init() {
            //// Update to full path if word is not at the root folder
            if (this.localWindow.MonacoEditorIntegration != undefined) {
                this.localWindow.MonacoEditorIntegration.initializeJsEditor('TxtRichApiScript', [
                    "/script/EditorIntelliSense/WordLatest.txt",
                    "/script/EditorIntelliSense/Office.Runtime.txt",
                    "/script/EditorIntelliSense/Helpers.txt",
                    "/script/EditorIntelliSense/jquery.txt",
                ]);
            }
        }
        
        LoadCode = (code: string) => {
            if (this.localWindow.MonacoEditorIntegration != undefined) {
                this.localWindow.MonacoEditorIntegration.setJavaScriptText(code); //$scope.selectedSample.code);
            }
        }
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigEditorCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigEditorCtrl]);
}