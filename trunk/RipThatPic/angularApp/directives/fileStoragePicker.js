var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileStoragePickerDirective = (function () {
            function FileStoragePickerDirective(pubSubConstants) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-picker.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStoragePickerController];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                };
            }
            FileStoragePickerDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    function (pubSubConstants) {
                        return new FileStoragePickerDirective(pubSubConstants);
                    }
                ];
            };
            return FileStoragePickerDirective;
        })();
        Directives.FileStoragePickerDirective = FileStoragePickerDirective;
        var FileStoragePickerController = (function () {
            function FileStoragePickerController($scope, $routeParams, $rootScope, $injector) {
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
            }
            return FileStoragePickerController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStoragePicker", FileStoragePickerDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStoragePicker.js.map