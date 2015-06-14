module Application.Controllers {
    export class HomeCtrl {

        constructor(public $scope: ng.IScope, public $rootScope: any) {

            this.init();
        }

        private init() {
            
            var __this = this;

            //this.$rootScope.$on("show-serviced",(evt, area) => {
            //    $("#dRequirements").show();
            //    $("#dWizard").show();

            //    this.$rootScope.$broadcast("wizard-step-selected", "step8");

            //});



        }
        
    }
}