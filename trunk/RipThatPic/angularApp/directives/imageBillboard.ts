module Application.Directives {
    //'use strict';
    export class ImageBillboardDirective implements ng.IDirective {

       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IImageBillboardScope ;
        public link: ($scope: IImageBillboardScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ng.INgModelController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E'; 
            this.replace = true;
            this.templateUrl = '/angularApp/partials/image-billboard.html';
           // this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl ];
            this.link = ($scope: IImageBillboardScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ng.INgModelController) =>
            {                
                this.scope = $scope; 
                this.scope.IMGBRootElement = element;
                this.scope.IMGBTimeBetweenEachFrame = 10000;  //10 seconds
                
                if (attributes.$attr["daBottom"]) this.scope.IMGBBottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.IMGBTop = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daLeft"]) this.scope.IMGBLeft = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.IMGBRight = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daHeight"]) this.scope.IMGBHeight = element.attr(<string>attributes.$attr["daHeight"]);
                if (attributes.$attr["daWidth"]) this.scope.IMGBWidth = element.attr(<string>attributes.$attr["daWidth"]);
                if (attributes.$attr["daItemHeight"]) this.scope.IMGBItemHeight = element.attr(<string>attributes.$attr["daItemHeight"]);
                if (attributes.$attr["daItemWidth"]) this.scope.IMGBItemWidth = element.attr(<string>attributes.$attr["daItemWidth"]);
                if (attributes.$attr["daHideNumbers"]) this.scope.IMGBHideNumbers = element.attr(<string>attributes.$attr["daHideNumbers"]) == "true" ? true : false;

                if (attributes.$attr["daCn"]) this.scope.IMGBCN = element.attr(<string>attributes.$attr["daCn"]);
                if (this.scope.IMGBCN == 'undefined' || this.scope.IMGBCN == undefined) this.scope.IMGBCN = '';



                var rootElement: any = $(element[0]);
                var setAbsolute: boolean = false;
                if ($scope.IMGBBottom != undefined && element) { rootElement.css('bottom', $scope.IMGBBottom); setAbsolute = true;}
                if ($scope.IMGBTop != undefined && element) { rootElement.css('top', $scope.IMGBTop); setAbsolute = true;}
                if ($scope.IMGBLeft != undefined && element) { rootElement.css('left', $scope.IMGBLeft); setAbsolute = true;}
                if ($scope.IMGBRight != undefined && element) { rootElement.css('right', $scope.IMGBRight); setAbsolute = true;}
                if ($scope.IMGBWidth != undefined && element) { rootElement.css('width', $scope.IMGBWidth); }
                if ($scope.IMGBHeight != undefined && element) { rootElement.css('height', $scope.IMGBHeight); }
                //if ($scope.IMGBItemWidth != undefined && element) { rootElement.css('width', parseInt($scope.IMGBItemWidth) + 20); }
                //if ($scope.IMGBItemHeight != undefined && element) { rootElement.css('height', parseInt($scope.IMGBItemHeight) + 20); }
                if (setAbsolute) rootElement.css('position', 'Absolute').css('padding', '0 5px 7px 5px');
                $('#imgbli').width(parseInt(this.scope.IMGBItemWidth) - 10 + 'px');
                if ($scope.IMGBHideNumbers) $('#imgbli').hide(); else $('#imgbli').show();

                this.scope.IMGBSelectedItems = [];
                this.scope.IMGBItemSelected = (evt) => { this.ItemSelected(this.scope, evt);}

                this.init();

            };




        }


        clearAnimation = () => {
            clearInterval(this.pointerAnimation);
            $('#imgbttn').width('0'); $('#imgbttn').stop();
            this.scope.IMGBCurrentIndex = -1;
            this.scope.IMGBItems = null;
            this.scope.IMGBItemNos = null;

        }


        pointerAnimation: number = 0;
        restartAnimation = () => {
            var __this = this;

            __this.clearAnimation();
            __this.pointerAnimation = setInterval(__this.changeImage, __this.scope.IMGBTimeBetweenEachFrame);
            setTimeout(__this.changeImage, 50);  //force a first image
        }

        changeImage = () => {
            this.changeImageToID('');
        }

        changeImageToID = (guidToLoad: any) => {
            var __this = this;

            if (__this.scope.IMGBItems == null || __this.scope.IMGBItems.length === 0) __this.scope.IMGBItems = __this.scope.IMGBRootElement.find('.item');
            if (__this.scope.IMGBItemNos == null || __this.scope.IMGBItemNos.length === 0) __this.scope.IMGBItemNos = __this.scope.IMGBRootElement.find('.itemno');
            
            __this.scope.IMGBItemNos.each((id, el) => { $(el).removeClass('selected'); });

            if (__this.scope.IMGBItems.length > 0) {
                var previousItem = __this.scope.IMGBItems[__this.scope.IMGBCurrentIndex];


                //determine next index to change to
                if (guidToLoad === '') {
                    __this.scope.IMGBCurrentIndex++;
                }
                else {
                    var indexToChangeTo = -1;
                    jQuery.each(__this.scope.IMGBItems, function (idx, el) {
                        if ($(el).data('id') === guidToLoad) indexToChangeTo = idx;
                    });
                    __this.scope.IMGBCurrentIndex = indexToChangeTo;
                }
                
                //if index is greater than number of images reset to start
                if (__this.scope.IMGBCurrentIndex >= __this.scope.IMGBItems.length) __this.scope.IMGBCurrentIndex = 0;


                var currentItem = __this.scope.IMGBItems[__this.scope.IMGBCurrentIndex];


                var id = $(currentItem).data('id');
                jQuery.each(__this.scope.IMGBItemNos,(idx) => {
                    var iit = __this.scope.IMGBItemNos[idx];
                    if ($(iit).data('id') === id) {
                        $(iit).addClass('selected');
                    }
                });


                if (__this.scope.IMGBCurrentIndex >= 0) $(previousItem).fadeOut(500);


                $('#imgbttn').animate({ width: __this.scope.IMGBItemWidth }, __this.scope.IMGBTimeBetweenEachFrame,() => { $('#imgbttn').width('0'); });

                $(currentItem).fadeIn(1000);
            }
        }



        private init() {
            this.initPubSub();
            if (this.scope.IMGBCN) {
                this.RefreshData();   
            }
        }

        initPubSub = () => {
            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.FileUploaded,
                this.RefreshData.bind(this),
                undefined);
          
            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.ImageContainerChanged,
                this.ContainerChanged.bind(this),
                undefined);

            this.scope.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded, __this.RefreshData);
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.ImageContainerChanged, __this.ContainerChanged );
        }

        private ContainerChanged(cn: string) {
            this.scope.IMGBCN = cn === '-all-'? '': cn;
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

            __this.scope.IMGBItemsList = [];
            
            if (__this.scope.IMGBCN === '') {
                this.dataSvc
                    .getAll("Image", __this.authService.sessionId)
                    .success(function (result: any) {
                        
                        __this.scope.IMGBItemsList = result;
                        $.each(__this.scope.IMGBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);

                            var firstPart = this.ContentType.substring(0, 5);
                            if (firstPart == 'image') {
                                this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                            } else if (firstPart == 'audio') {
                                this._ImgUrl = '/Content/placeholders/audio-wide.png';
                            } else if (firstPart == 'video') {
                                this._ImgUrl = '/Content/placeholders/video-wide.png';
                            } else if (firstPart == 'appli') {
                                this._ImgUrl = '/Content/placeholders/file-wide.png';
                            } else {
                                this._ImgUrl = '/Content/placeholders/unknown-wide.png';
                            }

                        });

                        __this.restartAnimation();

                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            } else {
                this.dataSvc
                    .getAllByGrouping("Image", __this.scope.IMGBCN, __this.authService.sessionId)
                    .success(function (result: any) {
                    
                        __this.scope.IMGBItemsList = [];
                        __this.scope.IMGBItemsList = result;
                        $.each(__this.scope.IMGBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);

                            var firstPart = this.ContentType.substring(0, 5);
                            if (firstPart == 'image') {
                                this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                            } else if (firstPart == 'audio') {
                                this._ImgUrl = '/Content/placeholders/audio-wide.png';
                            } else if (firstPart == 'video') {
                                this._ImgUrl = '/Content/placeholders/video-wide.png';
                            } else if (firstPart == 'appli') {
                                this._ImgUrl = '/Content/placeholders/file-wide.png';
                            } else {
                                this._ImgUrl = '/Content/placeholders/unknown-wide.png';
                            }
                        });

                        __this.restartAnimation();
                    
                        __this._isRefreshing = false;
                    })
                    .error(function (err) { });
            }

        }


        ItemSelected = (scope: IImageBillboardScope, evt: any) => {
            
            //now do stuff with the selected item
            var el = evt.currentTarget;

            clearInterval(this.pointerAnimation);
            $('#imgbttn').width('0'); $('#imgbttn').stop();
            this.changeImageToID($(el).data('id'));
            this.pointerAnimation = setInterval(this.changeImage, this.scope.IMGBTimeBetweenEachFrame);
            
            
        }

        safeApply= (scope: any, fn: Function) => {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }
    }

    export interface IImageBillboardScope extends ng.IScope {
       
        IMGBItemsList: Array<any>;
        IMGBBottom: string;
        IMGBTop: string;
        IMGBLeft: string;
        IMGBRight: string;
        IMGBHeight: string;
        IMGBWidth: string;
        IMGBItemHeight: string;
        IMGBItemWidth: string;
        IMGBCN: string;
        IMGBHideNumbers: boolean;

        //IMGBLocationStyle: string;

        IMGBItemSelected: Function;
        IMGBSelectedItems: Array<any>;

        IMGBTimeBetweenEachFrame: number;
        IMGBRootElement: ng.IAugmentedJQuery;
        IMGBCurrentIndex: number;
        IMGBItems: any;
        IMGBItemNos: any;
    }
    


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive( "dImageBillboard", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new ImageBillboardDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}


















