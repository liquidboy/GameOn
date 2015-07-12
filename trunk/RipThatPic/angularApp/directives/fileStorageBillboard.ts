﻿module Application.Directives {
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
                
                if (attributes.$attr["daBottom"]) this.scope.FSBBottom = element.attr(<string>attributes.$attr["daBottom"]);
                if (attributes.$attr["daTop"]) this.scope.FSBTop = element.attr(<string>attributes.$attr["daTop"]);
                if (attributes.$attr["daLeft"]) this.scope.FSBLeft = element.attr(<string>attributes.$attr["daLeft"]);
                if (attributes.$attr["daRight"]) this.scope.FSBRight = element.attr(<string>attributes.$attr["daRight"]);
                if (attributes.$attr["daItemHeight"]) this.scope.FSBItemHeight = element.attr(<string>attributes.$attr["daItemHeight"]);
                if (attributes.$attr["daItemWidth"]) this.scope.FSBItemWidth = element.attr(<string>attributes.$attr["daItemWidth"]);

                if (attributes.$attr["daCn"]) this.scope.FSBCN = element.attr(<string>attributes.$attr["daCn"]);
                if (this.scope.FSBCN == 'undefined' || this.scope.FSBCN == undefined) this.scope.FSBCN = '';


                var finalStyle: string = '';
                if ($scope.FSBBottom != undefined) finalStyle += "Bottom: " + $scope.FSBBottom + ";";
                if ($scope.FSBTop != undefined) finalStyle += "Top: " + $scope.FSBTop + ";";
                if ($scope.FSBLeft != undefined) finalStyle += "Left: " + $scope.FSBLeft + ";";
                if ($scope.FSBRight != undefined) finalStyle += "Right: " + $scope.FSBRight + ";";
                //if ($scope.FSBItemWidth != undefined) finalStyle += "Width: " + $scope.FSBItemWidth + ";";
                //if ($scope.FSBItemHeight != undefined) finalStyle += "Height: " + $scope.FSBItemHeight + ";";
                this.scope.FSBLocationStyle = finalStyle;



                this.scope.FSBSelectedItems = [];
                this.scope.FSBItemSelected = (evt) => { this.ItemSelected(this.scope, evt);}

                this.init();

            };




        }


        pointerAnimation: number = 0;
        restartAnimation = () => {
            var __this = this;
            //setup rotating animation
            
            clearInterval(__this.pointerAnimation);
            __this.scope.FSBCurrentIndex = 0;

            __this.pointerAnimation = setInterval(() => {
                var items = __this.scope.FSBRootElement.find('.item');
                var itemnos = __this.scope.FSBRootElement.find('.itemno');

                itemnos.each((id, el) => { $(el).removeClass('selected'); });

                if (items.length > 0) {
                    var item = items[__this.scope.FSBCurrentIndex];
                    var id = $(item).data('id');
                    jQuery.each(itemnos,(idx) => {
                        var iit = itemnos[idx];
                        if ($(iit).data('id') === id) {
                            $(iit).addClass('selected');
                        }
                    });
                    

                    if (__this.scope.FSBCurrentIndex >= 0) $(item).fadeOut(500);

                    __this.scope.FSBCurrentIndex++;
                    if (__this.scope.FSBCurrentIndex >= items.length) __this.scope.FSBCurrentIndex = 0;

                    $(item).fadeIn(1000);
                }
            }, 5000);

        }

        private init() {
            this.initPubSub();
            //this.RefreshData();   
        }

        initPubSub = () => {

          
            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.FileStorageContainerChanged,
                this.ContainerChanged.bind(this),
                undefined);

            this.scope.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
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
        FSBItemHeight: string;
        FSBItemWidth: string;
        FSBCN: string;

        FSBLocationStyle: string;

        FSBItemSelected: Function;
        FSBSelectedItems: Array<any>;

        FSBRootElement: ng.IAugmentedJQuery;
        FSBCurrentIndex: number;
    }
    


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive( "dFileStorageBillboard", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new FileStorageBillboardDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}

















