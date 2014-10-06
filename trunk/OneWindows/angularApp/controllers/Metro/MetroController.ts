//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
module Application.Controllers {
    export class MetroCtrl {
        constructor(public $scope: ng.IScope, public resourceSvc: any) {
            this.init();
        }

        private init() {
            this.loadResources();
        }

        private loadResources() {

            //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
        }
    }
}

//window["app"].controller("MetroCtrl", ["$scope", "resourceSvc", Application.Controllers.MetroCtrl]);

 