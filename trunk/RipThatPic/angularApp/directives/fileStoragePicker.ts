module Application.Directives {
    //'use strict';
    export class FileStoragePickerDirective implements ng.IDirective {

       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: Application.Controllers.IExplorerController ;

        public link: ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-picker.html';
            //this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
            this.link = ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) =>
            {                
                this.scope = $scope;
           
                

                if (attributes.$attr["daBottom"]) this.scope.FSPBottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.FSPTop = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daLeft"]) this.scope.FSPLeft = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.FSPRight = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daWidth"]) this.scope.FSPWidth = element.attr(<string>attributes.$attr["daWidth"]);

                


                var rootElement: any = $(element[0]);
                if ($scope.FSPBottom != undefined && element) {  rootElement.css('bottom', $scope.FSPBottom); }
                if ($scope.FSPTop != undefined && element) { rootElement.css('top', $scope.FSPTop); }
                if ($scope.FSPLeft != undefined && element) { rootElement.css('left', $scope.FSPLeft); }
                if ($scope.FSPRight != undefined && element) { rootElement.css('right', $scope.FSPRight); }
                if ($scope.FSPWidth != undefined && element) { rootElement.css('width', $scope.FSPWidth); }
                

                this.scope.FSPItemSelected = (evt) => { this.ItemSelected(this.scope, evt); }

                this.init();
            };


        }

        private init() {
            this.initPubSub();
            this.RefreshData();

        }

        private RefreshData() {
            this.RefreshGroupings();
        }

        private RefreshGroupings() {
            var __this = this;

            this.dataSvc
                .getGroupings('filestorage', __this.authService.sessionId)
                .success(function (result: any) { __this.scope.FSPList = result; })
                .error(function (err) { });
        }

        initPubSub = () => {

            //this.radioPubSubSvc.subscribe(
            //    this.pubSubConstants.FileUploaded,
            //    this.RefreshData.bind(this),
            //    undefined);

            //this.scope.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded,() => { __this.RefreshData(); });
        }

        ItemSelected = (scope: Application.Controllers.IExplorerController, evt: any) => {

            if (scope.FSPSelectedItem) {
                $(scope.FSPSelectedItem).removeClass('selected');
                scope.FSPSelectedItem = null;
            }

            var el = evt.currentTarget;
            $(el).addClass('selected');
            scope.FSPSelectedItem = el;

            var cn = $(el).data('id');
            
            this.radioPubSubSvc.publish(this.pubSubConstants.FileStorageContainerChanged, cn);
        };
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileStoragePicker", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new FileStoragePickerDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}



















