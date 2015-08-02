var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var InlineWindowDirective = (function () {
            function InlineWindowDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.initPubSub = function () {
                    //this.radioPubSubSvc.subscribe(
                    //    this.pubSubConstants.FileUploaded,
                    //    this.RefreshData.bind(this),
                    //    undefined);
                    //this.scope.$on('$destroy', this.destructor);
                };
                this.destructor = function () {
                    var __this = _this;
                    //this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded,() => { __this.RefreshData(); });
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/inline-window.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    _this.init();
                };
            }
            InlineWindowDirective.prototype.init = function () {
                this.initPubSub();
                this.RefreshData();
            };
            InlineWindowDirective.prototype.RefreshData = function () {
            };
            return InlineWindowDirective;
        })();
        Directives.InlineWindowDirective = InlineWindowDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dInlineWindow", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new InlineWindowDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=inlineWindow.js.map