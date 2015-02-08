//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
module Application.Controllers {

    import Services = Application.Services;

    export class HomeCtrl {
        constructor(public $scope: ng.IScope, public resourceSvc: Services.IResource, public dataSvc: Services.IData) {
            //this.init();

            this.resourceSvc.something(function (data) {

                //alert(data.result);
            });
        }

        private init() {
            this.loadResources();
        }

        private loadResources() {

            //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
        }
    }
}

//window["app"].controller("HomeCtrl", ["$scope", "resourceSvc", Application.Controllers.HomeCtrl]);