module Application.Controllers {
    export class ConfigAreaCtrl {

        AreasList: Array<any>;

        SelectedArea: any = {
            Name: "",
            LongName: "",
            Grouping: "",
            Color: ""
        };



        constructor(public $scope: ng.IScope, public $rootScope: any, public serviceHelperSvc: Application.Services.IServiceHelper, public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteArea = () => {

            var __this = this;

            this.dataSvc
                .deleteArea(__this.SelectedArea.Name, __this.SelectedArea.Grouping)
                .success(function (result:any) { __this.RefreshData();})
                .error(function (err:any) { alert('failure deleting..')});
            
        }

        private init() {
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAllAreas()
                .success(function (result: any) {
                //alert(result[0].PartitionKey);
                __this.AreasList = result;
                __this.$scope.$apply();
            })
                .error(function (err) { });
        }

        SaveArea = () => {

            var __this:any = this;

            this.dataSvc.saveArea(__this.SelectedArea.Name, __this.SelectedArea.Grouping, __this.SelectedArea.Color, __this.SelectedArea.LongName)
                .success(function (val) { __this.RefreshData();})
                .error(function (val) { alert('Failed saving area');})
            ;

        }

        SelectAreaRow = (model, event) => {
            var trElement = event.currentTarget;
            
            this.SelectedArea.Name = model.Name;
            this.SelectedArea.LongName = model.LongName;
            this.SelectedArea.Color = model.Color;
            this.SelectedArea.Grouping = model.Grouping;
        }

        testclick = () => {
            //this.serviceHelperSvc.testCall();
            
            //this.dataSvc.getAllAreasByGrouping("gaming")
            //    .success(function (result: any) {
            //        alert(result.length);
            //    })
            //    .error(function (err) { });
        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigAreaCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigAreaCtrl]);
}