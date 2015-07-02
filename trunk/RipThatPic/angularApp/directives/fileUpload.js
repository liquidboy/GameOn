var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileUploadDirective = (function () {
            function FileUploadDirective() {
                this.scope = {};
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/fileupload.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileUploadController];
                this.link = function ($scope, element, attributes, controller) {
                    //var selectedTab: string = "";
                    //if (attributes.$attr["daSelectedTab"]) {
                    //    selectedTab = element.attr(<string>attributes.$attr["daSelectedTab"]); 
                    //}
                    //var foundTab = element.find('a[data-id="' + selectedTab + '"]');
                    //foundTab.addClass("active");
                    //if (selectedTab === 'home') {
                    //    var menuConfig = element.find('span[data-id="menu-config"]');
                    //    menuConfig.addClass('hidden');
                    //}
                };
            }
            FileUploadDirective.prototype.injection = function () {
                return [
                    function () {
                        return new FileUploadDirective();
                    }
                ];
            };
            FileUploadDirective.$inject = [function () {
                return new FileUploadDirective();
            }];
            return FileUploadDirective;
        })();
        Directives.FileUploadDirective = FileUploadDirective;
        var FileUploadController = (function () {
            function FileUploadController($scope, $routeParams, $rootScope, $injector) {
                //$scope.Title = "Search Serviced";
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
                //this.$rootScope.$on("load-step",(evt, step) => {
                //    //$scope.SubTitle = "";
                //    $scope.$apply();
                //});
            }
            return FileUploadController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileUpload", FileUploadDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileUpload.js.map