module Application.Directives {
    //'use strict';
    export class FileStorageListDirective implements ng.IDirective {

       
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
            this.templateUrl = '/angularApp/partials/file-storage-list.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl ];
            this.link = ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) =>
            {                
                this.scope = $scope;
                
                if (attributes.$attr["daBottom"]) this.scope.FSBottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.FSTop = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daItemHeight"]) this.scope.FSItemHeight = element.attr(<string>attributes.$attr["daItemHeight"]);
                if (attributes.$attr["daLeft"]) this.scope.FSLeft = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.FSRight = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daIsMultipleSelection"]) this.scope.FSIsMultipleSelection = element.attr(<string>attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;

                if (attributes.$attr["daCn"]) this.scope.FSCN = element.attr(<string>attributes.$attr["daCn"]);
                if (this.scope.FSCN == 'undefined' || this.scope.FSCN == undefined) this.scope.FSCN = '';


                this.scope.FSSelectedItems = [];
                this.scope.FSItemSelected = (evt) => { this.ItemSelected(this.scope, evt);}

                this.init();
               
            };


        }

        private init() {
            this.initPubSub();
            //this.RefreshData();   
        }

        initPubSub = () => {

            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.FileUploaded,
                this.RefreshData.bind(this),
                undefined);

            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.FileStorageContainerChanged,
                this.ContainerChanged.bind(this),
                undefined);

            this.scope.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded, __this.RefreshData );
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileStorageContainerChanged, __this.ContainerChanged );
        }

        private ContainerChanged(cn: string) {
            this.scope.FSCN = cn === '-all-'? '': cn;
            this.RefreshData();
        }

        _isRefreshing: boolean = false;
        private RefreshData() {
            var __this = this;
            
            //stop refreshing being called again if its currently running
            if (__this._isRefreshing) return;
            
            //tag this method as already running
            __this._isRefreshing = true;  

            __this.scope.FSItemsList = [];
            
            if (__this.scope.FSCN === '') {
                this.dataSvc
                    .getAll("FileStorage", __this.authService.sessionId)
                    .success(function (result: any) {
                        
                        __this.scope.FSItemsList = result;
                        $.each(__this.scope.FSItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);
                        });

                        //justified gallery lib - http://miromannino.github.io/Justified-Gallery/
                        try {
                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');
                        } catch (e) { }

                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            } else {
                this.dataSvc
                    .getAllByGrouping("FileStorage", __this.scope.FSCN, __this.authService.sessionId)
                    .success(function (result: any) {
                    
                        //__this.scope.ItemsList = [];
                        //$.each(result, function () {
                        //    this.SizeKB = Math.round(this.Size / 1000);
                        //    __this.scope.ItemsList.push(this);
                        //});

                        __this.scope.FSItemsList = [];
                        __this.scope.FSItemsList = result;
                        $.each(__this.scope.FSItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);
                        });

                        //justified gallery lib - http://miromannino.github.io/Justified-Gallery/
                        try {
                            //__this.scope.$apply(); //<-- its important to "apply" angular binding changes otherwise the justifiedlib does not correctly layout stuff
                            //eval('$("#fsl").justifiedGallery();');


                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');

                        } catch (e) { }

                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            }

        }


        ItemSelected = (scope: Application.Controllers.IExplorerController, evt: any) => {
            
            //now do stuff with the selected item
            var el = evt.currentTarget;

            //see if its already in the list
            var foundItInList = null;
            $.each(scope.FSSelectedItems,(index) => {
                var elm: any = scope.FSSelectedItems[index];
                if ($(elm).data('id') === $(el).data('id')) {
                    foundItInList = el;
                }
            });

            if (scope.FSIsMultipleSelection) { //MULTIPLE SELECTION
                if (foundItInList != null) { //already selected so unselect it
                    $(foundItInList).removeClass('selected');
                    $(foundItInList).find('.chk').hide();
                    var index = scope.FSSelectedItems.indexOf(foundItInList);
                    scope.FSSelectedItems.splice(index, 1);
                } else { //its new so add it to the list
                    $(el).addClass('selected');
                    $(el).find('.chk').show();
                    scope.FSSelectedItems.push(el);
                }
            } else { //SINGLE SELECTION
                if (foundItInList != null) { // already selected so unselect it
                    $(foundItInList).removeClass('selected');
                    $(foundItInList).find('.chk').hide();
                    var index = scope.FSSelectedItems.indexOf(foundItInList);
                    scope.FSSelectedItems.splice(index, 1);
                } else {

                    //clear list of anything 
                    if (scope.FSSelectedItems !== null && scope.FSSelectedItems.length >= 1) {
                        $(scope.FSSelectedItems).removeClass('selected');
                        $(scope.FSSelectedItems).find('.chk').hide();
                        scope.FSSelectedItems = [];
                    }

                    //now add this single item into the list
                    $(el).addClass('selected');
                    $(el).find('.chk').show();
                    scope.FSSelectedItems.push(el);
                }
            }
            
        }

        safeApply= (scope: any, fn: Function) => {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }


    


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive( "dFileStorageList", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new FileStorageListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}

















