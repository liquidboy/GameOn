var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var BillboardDirective = (function () {
            function BillboardDirective() {
                this.scope = {};
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/billboard.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', BillboardController];
                this.link = function ($scope, element, attributes, controller) {
                };
            }
            BillboardDirective.prototype.injection = function () {
                return [
                    function () { return new BillboardDirective(); }
                ];
            };
            BillboardDirective.$inject = [function () { return new BillboardDirective(); }];
            return BillboardDirective;
        })();
        Directives.BillboardDirective = BillboardDirective;
        var BillboardController = (function () {
            function BillboardController($scope, $routeParams, $rootScope, $injector) {
                //$scope.Title = "Search Serviced";
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
                this.CurrentImageIndex = 0;
                this.ImagesResource = [
                    '/content/videos/regusvid2.PNG',
                    '/content/videos/regusvid3.PNG',
                    '/content/billboards/2.jpg',
                    '/content/billboards/1.jpg',
                    '/content/billboards/8.jpg',
                    '/content/billboards/3.jpg',
                    '/content/billboards/4.jpg',
                    '/content/billboards/5.jpg',
                    '/content/billboards/6.jpg',
                    '/content/billboards/7.jpg'
                ];
                this.$rootScope.$on("load-step", function (evt, step) {
                    //$scope.SubTitle = "";
                    $scope.$apply();
                });
            }
            return BillboardController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dBillboard", BillboardDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
