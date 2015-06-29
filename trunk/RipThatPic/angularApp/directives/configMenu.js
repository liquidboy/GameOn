var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ConfigMenuDirective = (function () {
            function ConfigMenuDirective() {
                this.scope = {};
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/configmenu.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', ConfigMenuController];
                this.link = function ($scope, element, attributes, controller) {
                    //eg. http://dotnetspeak.com/2013/12/angular-and-dom-manipulations-in-directives
                    var selectedTab = "";
                    if (attributes.$attr["daSelectedTab"]) {
                        selectedTab = element.attr(attributes.$attr["daSelectedTab"]);
                    }
                    var foundTab = element.find('a[data-id="' + selectedTab + '"]');
                    foundTab.addClass("active");
                    if (selectedTab === 'home') {
                        var menuConfig = element.find('span[data-id="menu-config"]');
                        menuConfig.addClass('hidden');
                    }
                };
            }
            ConfigMenuDirective.prototype.injection = function () {
                return [
                    function () {
                        return new ConfigMenuDirective();
                    }
                ];
            };
            ConfigMenuDirective.$inject = [function () {
                return new ConfigMenuDirective();
            }];
            return ConfigMenuDirective;
        })();
        Directives.ConfigMenuDirective = ConfigMenuDirective;
        var ConfigMenuController = (function () {
            function ConfigMenuController($scope, $routeParams, $rootScope, $injector) {
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
            return ConfigMenuController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dConfigMenu", ConfigMenuDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configMenu.js.map