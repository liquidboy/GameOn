var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ConfigMenuDirective = (function () {
            function ConfigMenuDirective(pubSubConstants, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.radioPubSubSvc = radioPubSubSvc;
                this.scope = {};
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/config-menu.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', ConfigMenuController];
                this.link = function ($scope, element, attributes, controller) {
                    //eg. http://dotnetspeak.com/2013/12/angular-and-dom-manipulations-in-directives
                    var __this = _this;
                    var selectedTab = "";
                    if (attributes.$attr["daSelectedTab"]) {
                        selectedTab = element.attr(attributes.$attr["daSelectedTab"]);
                    }
                    var foundTab = element.find('a[data-id="' + selectedTab + '"]');
                    foundTab.addClass("active");
                    if (selectedTab === 'home' || selectedTab === 'login' || selectedTab === 'explorer') {
                        var menuConfig = element.find('span[data-id="menu-config"]');
                        menuConfig.addClass('hidden');
                    }
                };
            }
            ConfigMenuDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "radioPubSubSvc",
                    function (pubSubConstants, radioPubSubSvc) {
                        return new ConfigMenuDirective(pubSubConstants, radioPubSubSvc);
                    }
                ];
            };
            ConfigMenuDirective.$inject = [function (pubSubConstants, radioPubSubSvc) {
                return new ConfigMenuDirective(pubSubConstants, radioPubSubSvc);
            }];
            return ConfigMenuDirective;
        })();
        Directives.ConfigMenuDirective = ConfigMenuDirective;
        var ConfigMenuController = (function () {
            function ConfigMenuController($scope, $routeParams, $rootScope, $injector) {
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
            }
            return ConfigMenuController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dConfigMenu", ConfigMenuDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configMenu.js.map