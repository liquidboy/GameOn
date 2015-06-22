module Application.Controllers {
    export class ConfigCtrl {

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

        private init() {
            
            var __this = this;


            this.dataSvc
                .getAllAreas()
                .success(function (result: any)
                {
                    //alert(result[0].PartitionKey);
                    __this.AreasList = result;
                    __this.$scope.$apply();
                })
                .error(function (err) { });

        }

        CreateArea = () => {

            var __this:any = this;

            this.dataSvc.addArea(__this.SelectedArea.Name, __this.SelectedArea.Grouping, __this.SelectedArea.Color, __this.SelectedArea.LongName)
                .success(function (val) { alert('Success creating area');})
                .error(function (val) { alert('Failed creating area');})
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
        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
}