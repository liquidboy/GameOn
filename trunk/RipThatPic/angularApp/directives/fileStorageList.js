var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileStorageListDirective = (function () {
            function FileStorageListDirective(pubSubConstants, dataSvc, authService) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.ItemSelected = function (scope, evt) {
                    //now do stuff with the selected item
                    var el = evt.currentTarget;
                    //see if its already in the list
                    var foundItInList = null;
                    $.each(scope.SelectedItems, function (index) {
                        var elm = scope.SelectedItems[index];
                        if ($(elm).data('id') === $(el).data('id')) {
                            foundItInList = el;
                        }
                    });
                    if (scope.IsMultipleSelection) {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.SelectedItems.indexOf(foundItInList);
                            scope.SelectedItems.splice(index, 1);
                        }
                        else {
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.SelectedItems.push(el);
                        }
                    }
                    else {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.SelectedItems.indexOf(foundItInList);
                            scope.SelectedItems.splice(index, 1);
                        }
                        else {
                            //clear list of anything 
                            if (scope.SelectedItems !== null && scope.SelectedItems.length >= 1) {
                                $(scope.SelectedItems).removeClass('selected');
                                $(scope.SelectedItems).find('.chk').hide();
                                scope.SelectedItems = [];
                            }
                            //now add this single item into the list
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.SelectedItems.push(el);
                        }
                    }
                };
                this.safeApply = function (scope, fn) {
                    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-list.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStorageListController];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.scope.Bottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.Top = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.ItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.Left = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.Right = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daIsMultipleSelection"])
                        _this.scope.IsMultipleSelection = element.attr(attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;
                    _this.scope.SelectedItems = [];
                    _this.scope.ItemSelected = function (evt) {
                        _this.ItemSelected(_this.scope, evt);
                    };
                    _this.init();
                };
            }
            FileStorageListDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    function (pubSubConstants, dataSvc, authService) {
                        return new FileStorageListDirective(pubSubConstants, dataSvc, authService);
                    }
                ];
            };
            FileStorageListDirective.prototype.init = function () {
                this.RefreshData();
            };
            FileStorageListDirective.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll("FileStorage", __this.authService.sessionId).success(function (result) {
                    __this.scope.ItemsList = result;
                    $.each(__this.scope.ItemsList, function () {
                        this.SizeKB = Math.round(this.Size / 1000);
                    });
                    try {
                        //__this.scope.$apply(); //<-- its important to "apply" angular binding changes otherwise the justifiedlib does not correctly layout stuff
                        //eval('$("#fsl").justifiedGallery();');
                        //freaking using apply was causing digest errors .. going with timeout approach
                        eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 100);');
                    }
                    catch (e) {
                    }
                }).error(function (err) {
                });
            };
            return FileStorageListDirective;
        })();
        Directives.FileStorageListDirective = FileStorageListDirective;
        var FileStorageListController = (function () {
            function FileStorageListController($scope, $routeParams, $rootScope, $injector) {
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
            }
            return FileStorageListController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStorageList", FileStorageListDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStorageList.js.map