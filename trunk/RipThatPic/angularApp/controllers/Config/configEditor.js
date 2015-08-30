var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigEditorCtrl = (function () {
            function ConfigEditorCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.localWindow = window;
                this.LoadCode = function (code) {
                    if (_this.localWindow.MonacoEditorIntegration != undefined) {
                        _this.localWindow.MonacoEditorIntegration.setJavaScriptText(code); //$scope.selectedSample.code);
                    }
                };
                //try {
                this.init();
                //} catch (e) { }
            }
            ConfigEditorCtrl.prototype.init = function () {
                //// Update to full path if word is not at the root folder
                if (this.localWindow.MonacoEditorIntegration != undefined) {
                    this.localWindow.MonacoEditorIntegration.initializeJsEditor('TxtRichApiScript', [
                        "/script/EditorIntelliSense/WordLatest.txt",
                        "/script/EditorIntelliSense/Office.Runtime.txt",
                        "/script/EditorIntelliSense/Helpers.txt",
                        "/script/EditorIntelliSense/jquery.txt",
                    ]);
                }
            };
            return ConfigEditorCtrl;
        })();
        Controllers.ConfigEditorCtrl = ConfigEditorCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigEditorCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigEditorCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
