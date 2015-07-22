var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ExtensionLiteDirective = (function () {
            function ExtensionLiteDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc, $sce) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.$sce = $sce;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/extension-lite.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                    __this.sc.ELGroup = $scope.Grouping + '|' + $scope.Name;
                    __this.sc.ELExtensions = [];
                    __this.sc.ELRunningScript = '';
                    _this.getBanner(__this.sc.ELGroup);
                    $(element).hide();
                    $(element).fadeIn(1500);
                };
            }
            ExtensionLiteDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    "radioPubSubSvc",
                    "$sce",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce) {
                        return new ExtensionLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce);
                    }
                ];
            };
            ExtensionLiteDirective.prototype.getBanner = function (group) {
                var __this = this;
                this.dataSvc.getAllByGrouping('extension', group, this.authService.sessionId).success(function (result) {
                    var runningHtml = '';
                    $(result).each(function (idx, obj) {
                        if (obj.IsExtensionStyleLiteEnabled) {
                            if (obj.ExtensionHtmlLite)
                                obj.ExtensionHtmlLiteSafe = __this.$sce.trustAsHtml(obj.ExtensionHtmlLite);
                            if (obj.ExtensionScriptLite)
                                runningHtml += obj.ExtensionScriptLite + '  ';
                            __this.sc.ELExtensions.push(obj);
                        }
                    });
                    __this.sc.ELRunningScript = __this.$sce.trustAsJs(runningHtml);
                    __this.sc.ELShowExtensions = __this.sc.ELExtensions.length > 0 ? true : false;
                }).error(function () {
                });
            };
            return ExtensionLiteDirective;
        })();
        Directives.ExtensionLiteDirective = ExtensionLiteDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dExtensionLite", ExtensionLiteDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=extensionLite.js.map