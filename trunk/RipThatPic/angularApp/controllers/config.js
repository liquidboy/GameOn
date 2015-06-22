var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.SelectedArea = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: ""
                };
                this.DeleteArea = function () {
                    //this.dataSvc.deleteArea
                };
                this.SaveArea = function () {
                    var __this = _this;
                    _this.dataSvc.addArea(__this.SelectedArea.Name, __this.SelectedArea.Grouping, __this.SelectedArea.Color, __this.SelectedArea.LongName).success(function (val) {
                        alert('Success saving area');
                    }).error(function (val) {
                        alert('Failed saving area');
                    });
                };
                this.SelectAreaRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedArea.Name = model.Name;
                    _this.SelectedArea.LongName = model.LongName;
                    _this.SelectedArea.Color = model.Color;
                    _this.SelectedArea.Grouping = model.Grouping;
                };
                this.testclick = function () {
                    //this.serviceHelperSvc.testCall();
                    //this.dataSvc.getAllAreas()
                    //    .success(function (result: any) {
                    //        //alert(result[0].PartitionKey);
                    //    })
                    //    .error(function (err) { });
                    //this.dataSvc.addArea("xbox", "gaming", "green", "Xbox One")
                    //    .success(function (val) { alert(val);})
                    //    .error(function (val) { alert(val);})
                    //;
                    //this.dataSvc.getAllAreasByGrouping("gaming")
                    //    .success(function (result: any) {
                    //        alert(result.length);
                    //    })
                    //    .error(function (err) { });
                };
                this.init();
            }
            ConfigCtrl.prototype.init = function () {
                var __this = this;
                this.dataSvc.getAllAreas().success(function (result) {
                    //alert(result[0].PartitionKey);
                    __this.AreasList = result;
                    __this.$scope.$apply();
                }).error(function (err) {
                });
            };
            return ConfigCtrl;
        })();
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map