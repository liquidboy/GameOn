var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigEditorCtrl = (function () {
            function ConfigEditorCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.localWindow = window;
                this.init();
            }
            ConfigEditorCtrl.prototype.init = function () {
                //// Update to full path if word is not at the root folder
                if (this.localWindow.MonacoEditorIntegration != undefined) {
                    this.localWindow.MonacoEditorIntegration.initializeJsEditor('TxtRichApiScript', [
                        "script/EditorIntelliSense/WordLatest.txt",
                        "script/EditorIntelliSense/Office.Runtime.txt",
                        "script/EditorIntelliSense/Helpers.txt",
                        "script/EditorIntelliSense/jquery.txt",
                    ]);
                }
            };
            return ConfigEditorCtrl;
        })();
        Controllers.ConfigEditorCtrl = ConfigEditorCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigEditorCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", ConfigEditorCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configEditor.js.map