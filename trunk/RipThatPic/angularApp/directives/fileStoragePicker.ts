module Application.Directives {
    //'use strict';
    export class FileStoragePickerDirective implements ng.IDirective {

       
        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authService, radioPubSubSvc) => { return new FileStoragePickerDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc); }
            ];
        }
       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IFileStoragePickerController ;

        public link: ($scope: IFileStoragePickerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStoragePickerController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-picker.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStoragePickerController];
            this.link = ($scope: IFileStoragePickerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStoragePickerController) =>
            {                
                this.scope = $scope;
           
                if (attributes.$attr["daBottom"]) this.scope.Bottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.Top = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daLeft"]) this.scope.Left = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.Right = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daWidth"]) this.scope.Width = element.attr(<string>attributes.$attr["daWidth"]);

                this.scope.LocationStyle = '';
                if ($scope.Bottom != undefined) this.scope.LocationStyle += "Bottom: " + $scope.Bottom + ";";
                if ($scope.Top != undefined) this.scope.LocationStyle += "Top: " + $scope.Top + ";";
                if ($scope.Left != undefined) this.scope.LocationStyle += "Left: " + $scope.Left + ";";
                if ($scope.Right != undefined) this.scope.LocationStyle += "Right: " + $scope.Right + ";";
                if ($scope.Width != undefined) this.scope.LocationStyle += "Width: " + $scope.Width + ";";
                


                this.scope.ItemSelected = (evt) => { this.ItemSelected(this.scope, evt); }

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

        ItemSelected = (scope: IFileStoragePickerController, evt: any) => {

        };
    }




    interface IFileStoragePickerController extends ng.IScope {
        FSPList: Array<any>;
        Bottom: string;
        Top: string;
        Left: string;
        Right: string;
        Width: string;

        LocationStyle: string;

        ItemSelected: Function;
    }
    class FileStoragePickerController {
      


        constructor(public $scope: IFileStoragePickerController,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {
            

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileStoragePicker", FileStoragePickerDirective.prototype.injection());
}



















