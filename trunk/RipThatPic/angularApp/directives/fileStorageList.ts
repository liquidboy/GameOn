module Application.Directives {
    //'use strict';
    export class FileStorageListDirective implements ng.IDirective {

        

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc",
                (pubSubConstants, dataSvc, authService) => { return new FileStorageListDirective(pubSubConstants, dataSvc, authService); }
            ];
        }
       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IFileStorageListController ;

        public link: ($scope: IFileStorageListController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStorageListController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants, public dataSvc: Application.Services.IData, public authService: Application.Services.IAuthService) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-list.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStorageListController];
            this.link = ($scope: IFileStorageListController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStorageListController) =>
            {                
                this.scope = $scope;
                
                if (attributes.$attr["daBottom"]) this.scope.Bottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.Top = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daItemHeight"]) this.scope.ItemHeight = element.attr(<string>attributes.$attr["daItemHeight"]);
                if (attributes.$attr["daLeft"]) this.scope.Left = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.Right = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daIsMultipleSelection"]) this.scope.IsMultipleSelection = element.attr(<string>attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;

                
                this.scope.SelectedItems = [];
                this.scope.ItemSelected = (evt) => { this.ItemSelected(this.scope, evt);}

                this.init();
               
            };


        }

        private init() {
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll("FileStorage", __this.authService.sessionId)
                .success(function (result: any) {

                    __this.scope.ItemsList = result;
                    $.each(__this.scope.ItemsList, function () {
                        this.SizeKB = Math.round(this.Size / 1000);
                    });

                    //justified gallery lib - http://miromannino.github.io/Justified-Gallery/
                    try {
                        //__this.scope.$apply(); //<-- its important to "apply" angular binding changes otherwise the justifiedlib does not correctly layout stuff
                        //eval('$("#fsl").justifiedGallery();');
                        

                        //freaking using apply was causing digest errors .. going with timeout approach
                        eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 100);');
                        
                    } catch (e){ }
                })
                .error(function (err) { });
        }


        ItemSelected = (scope: IFileStorageListController, evt: any) => {

            


            //now do stuff with the selected item
            var el = evt.currentTarget;

            //see if its already in the list
            var foundItInList = null;
            $.each(scope.SelectedItems,(index) => {
                var elm: any = scope.SelectedItems[index];
                if (elm.uniqueID === el.uniqueID) {
                    foundItInList = el;
                }
            });

            if (scope.IsMultipleSelection) { //MULTIPLE SELECTION
                if (foundItInList != null) { //already selected so unselect it
                    $(foundItInList).removeClass('selected');
                    $(foundItInList).find('.chk').hide();
                    var index = scope.SelectedItems.indexOf(foundItInList);
                    scope.SelectedItems.splice(index, 1);
                } else { //its new so add it to the list
                    $(el).addClass('selected');
                    $(el).find('.chk').show();
                    scope.SelectedItems.push(el);
                }
            } else { //SINGLE SELECTION
                if (foundItInList != null) { // already selected so unselect it
                    $(foundItInList).removeClass('selected');
                    $(foundItInList).find('.chk').hide();
                    var index = scope.SelectedItems.indexOf(foundItInList);
                    scope.SelectedItems.splice(index, 1);
                } else {

                    //clear list of anything 
                    if (scope.SelectedItems !== null && scope.SelectedItems.length >= 1) {
                        $(scope.SelectedItems).removeClass('selected');
                        $(scope.SelectedItems).find('.chk').hide();
                        scope.SelectedItems = [];
                    }

                    //now add this single item into the list
                    $(el).addClass('selected');
                    $(el).find('.chk').show();
                    scope.SelectedItems.push(el);
                }
            }
            
        }

        safeApply= (scope: any, fn: Function) => {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }




    interface IFileStorageListController extends ng.IScope {
        ItemsList: Array<any>;
        Bottom: string;
        Top: string;
        Left: string;
        Right: string;
        ItemHeight: string;

        ItemSelected: Function;
        SelectedItems: Array<any>;

        IsMultipleSelection: boolean;
    }
    class FileStorageListController {
      


        constructor(public $scope: IFileStorageListController,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {
            

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileStorageList",  FileStorageListDirective.prototype.injection());
}

















