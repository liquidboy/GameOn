module Application.Directives {
    //'use strict';
    export class FileStorageListDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new FileStorageListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }
       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;

        public sc: IFileStorageListScope ;
        public link: ($scope: IFileStorageListScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-list.html';
            
            this.link = ($scope: IFileStorageListScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) =>
            {                

                this.sc = $scope;
                
                if (attributes.$attr["daBottom"]) this.sc.FSBottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.sc.FSTop = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daItemHeight"]) this.sc.FSItemHeight = element.attr(<string>attributes.$attr["daItemHeight"]);
                if (attributes.$attr["daLeft"]) this.sc.FSLeft = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.sc.FSRight = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daIsMultipleSelection"]) this.sc.FSIsMultipleSelection = element.attr(<string>attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;

                if (attributes.$attr["daCn"]) this.sc.FSCN = element.attr(<string>attributes.$attr["daCn"]);
                if (this.sc.FSCN == 'undefined' || this.sc.FSCN == undefined) this.sc.FSCN = '';


                this.sc.FSSelectedItems = [];
                this.sc.FSSelectedIds = [];
                this.sc.FSItemSelected = (evt) => { this.ItemSelected(this.sc, evt);}

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

            this.sc.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded, __this.RefreshData );
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileStorageContainerChanged, __this.ContainerChanged );
        }

        private ContainerChanged(cn: string) {
            this.sc.FSCN = cn === '-all-'? '': cn;
            this.RefreshData();
        }

        _isRefreshing: boolean = false;
        private RefreshData() {
            var __this = this;
            
            //stop refreshing being called again if its currently running
            if (__this._isRefreshing) return;
            
            //tag this method as already running
            __this._isRefreshing = true;  

            __this.sc.FSItemsList = [];
            
            if (__this.sc.FSCN === '') {
                this.dataSvc
                    .getAll("FileStorage", __this.authService.sessionId)
                    .success(function (result: any) {
                        
                        __this.sc.FSItemsList = result;
                        $.each(__this.sc.FSItemsList, function () {
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
                    .getAllByGrouping("FileStorage", __this.sc.FSCN, __this.authService.sessionId)
                    .success(function (result: any) {
                    
                        //__this.sc.ItemsList = [];
                        //$.each(result, function () {
                        //    this.SizeKB = Math.round(this.Size / 1000);
                        //    __this.sc.ItemsList.push(this);
                        //});

                        __this.sc.FSItemsList = [];
                        __this.sc.FSItemsList = result;
                        $.each(__this.sc.FSItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);

                            var firstPart = this.ContentType.substring(0, 5);

                            if (firstPart == 'image') {
                                this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                            } else if (firstPart == 'audio') {
                                this._ImgUrl = '/Content/placeholders/audio.png';
                            } else if (firstPart == 'video') {
                                this._ImgUrl = '/Content/placeholders/video.png';
                            } else if (firstPart == 'appli') {
                                this._ImgUrl = '/Content/placeholders/file.png';
                            } else {
                                this._ImgUrl = '/Content/placeholders/unknown.png';
                            }
                            

                        });

                        //justified gallery lib - http://miromannino.github.io/Justified-Gallery/
                        try {
                            //__this.sc.$apply(); //<-- its important to "apply" angular binding changes otherwise the justifiedlib does not correctly layout stuff
                            //eval('$("#fsl").justifiedGallery();');


                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');

                        } catch (e) { }

                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            }

        }


        ItemSelected = (scope: IFileStorageListScope, evt: any) => {
            
            //now do stuff with the selected item
            var el = evt.currentTarget;
            var did = $(el).data('id');

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

                    var indexid = scope.FSSelectedIds.indexOf(did);
                    scope.FSSelectedIds.splice(indexid, 1);
                } else { //its new so add it to the list
                    $(el).addClass('selected');
                    $(el).find('.chk').show();
                    scope.FSSelectedItems.push(el);
                    scope.FSSelectedIds.push(did);
                }
            } else { //SINGLE SELECTION
                if (foundItInList != null) { // already selected so unselect it
                    $(foundItInList).removeClass('selected');
                    $(foundItInList).find('.chk').hide();
                    var index = scope.FSSelectedItems.indexOf(foundItInList);
                    scope.FSSelectedItems.splice(index, 1);

                    var indexid = scope.FSSelectedIds.indexOf(foundItInList);
                    scope.FSSelectedIds.splice(indexid, 1);
                } else {

                    //clear list of anything 
                    if (scope.FSSelectedItems !== null && scope.FSSelectedItems.length >= 1) {
                        $(scope.FSSelectedItems).removeClass('selected');
                        $(scope.FSSelectedItems).find('.chk').hide();
                        scope.FSSelectedItems = [];
                    }
                    scope.FSSelectedIds = [];

                    //now add this single item into the list
                    $(el).addClass('selected');
                    $(el).find('.chk').show();
                    scope.FSSelectedItems.push(el);
                    scope.FSSelectedIds.push(did);
                }
            }
            
            this.radioPubSubSvc.publish(this.pubSubConstants.FileStorageListSelectionsChanged, scope.FSSelectedIds.join());
        }

        safeApply= (scope: any, fn: Function) => {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }

    export interface IFileStorageListScope extends ng.IScope {
        //FileStorage
        FSItemsList: Array<any>;
        FSBottom: string;
        FSTop: string;
        FSLeft: string;
        FSRight: string;
        FSItemHeight: string;
        FSCN: string;

        FSItemSelected: Function;
        FSSelectedItems: Array<any>;
        FSSelectedIds: Array<string>;

        FSIsMultipleSelection: boolean;
    }

    
 

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileStorageList", FileStorageListDirective.prototype.injection() );
}

















