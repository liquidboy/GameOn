var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var PostLiteDirective = (function () {
            function PostLiteDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/post-lite.html';
                //this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes) {
                    //this.scope = $scope;
                    _this.sc = $scope;
                    var __this = _this;
                    __this.sc.PsLGroup = $scope.Grouping + '|' + $scope.Name;
                    _this.getPost($scope.Grouping, $scope.Name);
                };
            }
            PostLiteDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new PostLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            PostLiteDirective.prototype.getPost = function (group, name) {
                var __this = this;
                this.dataSvc
                    .get('post', group, name, this.authService.sessionId)
                    .success(function (result) {
                    __this.sc.PsLData = result.Post;
                    __this.sc.PsLStyle = result.Post.PostStyle;
                    __this.sc.PsLFonts = result.FontsMetadata;
                    __this.sc.PsLBannerPhoto = result.BannerPhoto;
                    __this.radioPubSubSvc.publish(__this.pubSubConstants.FileStorageContainerChanged, result.Post.PhotoGroup);
                })
                    .error(function () { });
            };
            return PostLiteDirective;
        })();
        Directives.PostLiteDirective = PostLiteDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dPostLite", PostLiteDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=postLite.js.map