//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
class HomeCtrl {
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
window["app"].controller("HomeCtrl", ["$scope", "resourceSvc", HomeCtrl]);