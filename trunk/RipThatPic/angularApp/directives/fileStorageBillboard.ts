module Application.Directives {
    //'use strict';
    export class FileStorageBillboardDirective implements ng.IDirective {

       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IFileStorageBillboardScope ;
        public link: ($scope: IFileStorageBillboardScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ng.INgModelController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-billboard.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl ];
            this.link = ($scope: IFileStorageBillboardScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ng.INgModelController) =>
            {                
                this.scope = $scope;
                this.scope.FSBRootElement = element;
                this.scope.FSBTimeBetweenEachFrame = 10000;  //10 seconds
                
                if (attributes.$attr["daBottom"]) this.scope.FSBBottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.FSBTop = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daLeft"]) this.scope.FSBLeft = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.FSBRight = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daHeight"]) this.scope.FSBHeight = element.attr(<string>attributes.$attr["daHeight"]);
                if (attributes.$attr["daWidth"]) this.scope.FSBWidth = element.attr(<string>attributes.$attr["daWidth"]);
                if (attributes.$attr["daItemHeight"]) this.scope.FSBItemHeight = element.attr(<string>attributes.$attr["daItemHeight"]);
                if (attributes.$attr["daItemWidth"]) this.scope.FSBItemWidth = element.attr(<string>attributes.$attr["daItemWidth"]);
                if (attributes.$attr["daHideNumbers"]) this.scope.FSBHideNumbers = element.attr(<string>attributes.$attr["daHideNumbers"]) == "true" ? true : false;

                if (attributes.$attr["daCn"]) this.scope.FSBCN = element.attr(<string>attributes.$attr["daCn"]);
                if (this.scope.FSBCN == 'undefined' || this.scope.FSBCN == undefined) this.scope.FSBCN = '';



                var rootElement: any = $(element[0]);
                if ($scope.FSBBottom != undefined && element) { rootElement.css('bottom', $scope.FSBBottom); }
                if ($scope.FSBTop != undefined && element) { rootElement.css('top', $scope.FSBTop); }
                if ($scope.FSBLeft != undefined && element) { rootElement.css('left', $scope.FSBLeft); }
                if ($scope.FSBRight != undefined && element) { rootElement.css('right', $scope.FSBRight); }
                if ($scope.FSBWidth != undefined && element) { rootElement.css('width', $scope.FSBWidth); }
                if ($scope.FSBHeight != undefined && element) { rootElement.css('height', $scope.FSBHeight); }
                //if ($scope.FSBItemWidth != undefined && element) { rootElement.css('width', parseInt($scope.FSBItemWidth) + 20); }
                //if ($scope.FSBItemHeight != undefined && element) { rootElement.css('height', parseInt($scope.FSBItemHeight) + 20); }

                $('#fsbli').width(parseInt(this.scope.FSBItemWidth) - 10 + 'px');
                if ($scope.FSBHideNumbers) $('#fsbli').hide(); else $('#fsbli').show();

                this.scope.FSBSelectedItems = [];
                this.scope.FSBItemSelected = (evt) => { this.ItemSelected(this.scope, evt);}

                this.init();

            };




        }


        clearAnimation = () => {
            clearInterval(this.pointerAnimation);
            $('#fsbttn').width('0'); $('#fsbttn').stop();
            this.scope.FSBCurrentIndex = -1;
            this.scope.FSBItems = null;
            this.scope.FSBItemNos = null;

        }


        pointerAnimation: number = 0;
        restartAnimation = () => {
            var __this = this;

            __this.clearAnimation();
            __this.pointerAnimation = setInterval(__this.changeImage, __this.scope.FSBTimeBetweenEachFrame);
            setTimeout(__this.changeImage, 50);  //force a first image
        }

        changeImage = () => {
            this.changeImageToID('');
        }

        changeImageToID = (guidToLoad: any) => {
            var __this = this;

            if (__this.scope.FSBItems == null || __this.scope.FSBItems.length === 0) __this.scope.FSBItems = __this.scope.FSBRootElement.find('.item');
            if (__this.scope.FSBItemNos == null || __this.scope.FSBItemNos.length === 0) __this.scope.FSBItemNos = __this.scope.FSBRootElement.find('.itemno');
            
            __this.scope.FSBItemNos.each((id, el) => { $(el).removeClass('selected'); });

            if (__this.scope.FSBItems.length > 0) {
                var previousItem = __this.scope.FSBItems[__this.scope.FSBCurrentIndex];


                //determine next index to change to
                if (guidToLoad === '') {
                    __this.scope.FSBCurrentIndex++;
                }
                else {
                    var indexToChangeTo = -1;
                    jQuery.each(__this.scope.FSBItems, function (idx, el) {
                        if ($(el).data('id') === guidToLoad) indexToChangeTo = idx;
                    });
                    __this.scope.FSBCurrentIndex = indexToChangeTo;
                }
                
                //if index is greater than number of images reset to start
                if (__this.scope.FSBCurrentIndex >= __this.scope.FSBItems.length) __this.scope.FSBCurrentIndex = 0;


                var currentItem = __this.scope.FSBItems[__this.scope.FSBCurrentIndex];


                var id = $(currentItem).data('id');
                jQuery.each(__this.scope.FSBItemNos,(idx) => {
                    var iit = __this.scope.FSBItemNos[idx];
                    if ($(iit).data('id') === id) {
                        $(iit).addClass('selected');
                    }
                });


                if (__this.scope.FSBCurrentIndex >= 0) $(previousItem).fadeOut(500);


                $('#fsbttn').animate({ width: __this.scope.FSBItemWidth }, __this.scope.FSBTimeBetweenEachFrame,() => { $('#fsbttn').width('0'); });

                $(currentItem).fadeIn(1000);
            }
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
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded, __this.RefreshData);
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileStorageContainerChanged, __this.ContainerChanged );
        }

        private ContainerChanged(cn: string) {
            this.scope.FSBCN = cn === '-all-'? '': cn;
            this.RefreshData();
        }

        _isRefreshing: boolean = false;
        private RefreshData() {
            var __this = this;
            
            //stop refreshing being called again if its currently running
            if (__this._isRefreshing) return;
            
            //tag this method as already running
            __this._isRefreshing = true;  
            
            __this.clearAnimation();

            __this.scope.FSBItemsList = [];
            
            if (__this.scope.FSBCN === '') {
                this.dataSvc
                    .getAll("FileStorage", __this.authService.sessionId)
                    .success(function (result: any) {
                        
                        __this.scope.FSBItemsList = result;
                        $.each(__this.scope.FSBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);
                        });

                        __this.restartAnimation();

                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            } else {
                this.dataSvc
                    .getAllByGrouping("FileStorage", __this.scope.FSBCN, __this.authService.sessionId)
                    .success(function (result: any) {
                    
                        __this.scope.FSBItemsList = [];
                        __this.scope.FSBItemsList = result;
                        $.each(__this.scope.FSBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);
                        });

                        __this.restartAnimation();
                    
                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            }

        }


        ItemSelected = (scope: IFileStorageBillboardScope, evt: any) => {
            
            //now do stuff with the selected item
            var el = evt.currentTarget;

            clearInterval(this.pointerAnimation);
            $('#fsbttn').width('0'); $('#fsbttn').stop();
            this.changeImageToID($(el).data('id'));
            this.pointerAnimation = setInterval(this.changeImage, this.scope.FSBTimeBetweenEachFrame);
            
            
        }

        safeApply= (scope: any, fn: Function) => {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }

    export interface IFileStorageBillboardScope extends ng.IScope {
       
        FSBItemsList: Array<any>;
        FSBBottom: string;
        FSBTop: string;
        FSBLeft: string;
        FSBRight: string;
        FSBHeight: string;
        FSBWidth: string;
        FSBItemHeight: string;
        FSBItemWidth: string;
        FSBCN: string;
        FSBHideNumbers: boolean;

        //FSBLocationStyle: string;

        FSBItemSelected: Function;
        FSBSelectedItems: Array<any>;

        FSBTimeBetweenEachFrame: number;
        FSBRootElement: ng.IAugmentedJQuery;
        FSBCurrentIndex: number;
        FSBItems: any;
        FSBItemNos: any;
    }
    


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive( "dFileStorageBillboard", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new FileStorageBillboardDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}


















