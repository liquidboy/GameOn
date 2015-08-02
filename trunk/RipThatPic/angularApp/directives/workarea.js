var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var WorkareaDirective = (function () {
            function WorkareaDirective() {
                this.scope = {};
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/workarea.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', WorkareaController];
                this.link = function ($scope, element, attributes, controller) {
                };
            }
            WorkareaDirective.prototype.injection = function () {
                return [
                    function () { return new WorkareaDirective(); }
                ];
            };
            WorkareaDirective.$inject = [function () { return new WorkareaDirective(); }];
            return WorkareaDirective;
        })();
        Directives.WorkareaDirective = WorkareaDirective;
        var WorkareaController = (function () {
            function WorkareaController($scope, $routeParams, $rootScope, $injector) {
                //$scope.Title = "Search Serviced";
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
                this.$rootScope.$on("load-step", function (evt, step) {
                    //$scope.SubTitle = "";
                    $scope.$apply();
                });
            }
            return WorkareaController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dWorkarea", WorkareaDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=workarea.js.map