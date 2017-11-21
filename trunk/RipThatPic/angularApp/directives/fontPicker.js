var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FontPickerDirective = (function () {
            function FontPickerDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.initPubSub = function () {
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.ClearFontsSelected, _this.ClearSelectedItems.bind(_this), undefined);
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.InitFontsSelected, _this.InitSelectedItems.bind(_this), undefined);
                    _this.sc.$on('$destroy', _this.destructor);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.ClearFontsSelected, _this.ClearSelectedItems);
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.InitFontsSelected, _this.InitSelectedItems);
                };
                this.ClearSelectedItems = function () {
                    var elms = $('input[type="checkbox"]');
                    $(elms).prop('checked', false);
                    _this.sc.FOPSelectedItems = [];
                };
                this.InitSelectedItems = function (ids) {
                    if (ids) {
                        var parts = ids.split(',');
                        _this.sc.FOPSelectedItems = [];
                        $.each(parts, function (idx, val) {
                            var elms = $('input[data-id="' + val + '"]');
                            $(elms[0]).prop('checked', true);
                            _this.sc.FOPSelectedItems.push(val);
                        });
                    }
                };
                this.ItemClicked = function (scope, evt) {
                    //now do stuff with the selected item
                    var el = evt.currentTarget;
                    var id = $(el).data('id');
                    if ($(el).is(':checked')) {
                        //check
                        if (!scope.FOPIsMultipleSelection) {
                            //need to unselect anything that is currently selected
                            $.each(scope.FOPSelectedItems, function (index) {
                                var selid = scope.FOPSelectedItems[index];
                                var elms = $('input[data-id="' + selid + '"]');
                                $(elms[0]).prop('checked', false);
                            });
                            scope.FOPSelectedItems = [];
                        }
                        scope.FOPSelectedItems.push(id);
                    }
                    else {
                        //uncheck
                        var index = scope.FOPSelectedItems.indexOf(id);
                        scope.FOPSelectedItems.splice(index, 1);
                    }
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.FontChanged, scope.FOPSelectedItems.join());
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/font-picker.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    _this.sc.FOPSelectedItems = [];
                    if (attributes.$attr["daGroup"])
                        _this.sc.FOPGroup = element.attr(attributes.$attr["daGroup"]);
                    if (attributes.$attr["daIsMultipleSelection"])
                        _this.sc.FOPIsMultipleSelection = element.attr(attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;
                    _this.sc.FOPItemClicked = function (evt) { _this.ItemClicked(_this.sc, evt); };
                    _this.init();
                };
            }
            FontPickerDirective.prototype.init = function () {
                this.initPubSub();
                this.RefreshData();
            };
            FontPickerDirective.prototype.RefreshData = function () {
                this.RefreshFonts();
            };
            FontPickerDirective.prototype.RefreshFonts = function () {
                var __this = this;
                this.dataSvc
                    .getAllByGrouping('Font', __this.sc.FOPGroup, __this.authService.sessionId)
                    .success(function (result) { __this.sc.FOPItemsList = result; })
                    .error(function (err) { });
            };
            return FontPickerDirective;
        }());
        Directives.FontPickerDirective = FontPickerDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFontPicker", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new FontPickerDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fontPicker.js.map