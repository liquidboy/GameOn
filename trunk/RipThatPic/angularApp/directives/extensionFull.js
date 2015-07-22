var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ExtensionFullDirective = (function () {
            function ExtensionFullDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc, $sce) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.$sce = $sce;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/extension-full.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                    __this.sc.EFGroup = $scope.Grouping + '|' + $scope.Name;
                    __this.sc.EFExtensions = [];
                    //__this.sc.EFRunningScript = '';
                    __this.sc.EFElement = element;
                    _this.getBanner(__this.sc.EFGroup);
                    $(element).hide();
                    $(element).fadeIn(1500);
                };
            }
            ExtensionFullDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    "radioPubSubSvc",
                    "$sce",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce) {
                        return new ExtensionFullDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce);
                    }
                ];
            };
            ExtensionFullDirective.prototype.getBanner = function (group) {
                var __this = this;
                this.dataSvc.getAllByGrouping('extension', group, this.authService.sessionId).success(function (result) {
                    var runningHtml = '';
                    $(result).each(function (idx, obj) {
                        if (obj.IsExtensionEnabled) {
                            if (obj.ExtensionHtml)
                                obj.ExtensionHtmlSafe = __this.$sce.trustAsHtml(obj.ExtensionHtml);
                            if (obj.ExtensionScript)
                                runningHtml += obj.ExtensionScript + '  ';
                            __this.sc.EFExtensions.push(obj);
                        }
                    });
                    //__this.sc.EFRunningScript = __this.$sce.trustAsJs(runningHtml);
                    if (runningHtml && runningHtml.length > 0)
                        $(__this.sc.EFElement).find(".dynamicjs").html("<script type='text/javascript'>" + runningHtml + "</script>");
                    __this.sc.EFShowExtensions = __this.sc.EFExtensions.length > 0 ? true : false;
                }).error(function () {
                });
            };
            return ExtensionFullDirective;
        })();
        Directives.ExtensionFullDirective = ExtensionFullDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dExtensionFull", ExtensionFullDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=extensionFull.js.map