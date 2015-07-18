module Application.Directives {
    //'use strict';
    export class FontPickerDirective implements ng.IDirective {

       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public sc: IFontPickerScope ;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/font-picker.html';

            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) =>
            {                
                this.sc = $scope;
                this.sc.FOPSelectedItems = [];
                
                if (attributes.$attr["daGroup"]) this.sc.FOPGroup = element.attr(<string>attributes.$attr["daGroup"]);
                if (attributes.$attr["daIsMultipleSelection"]) this.sc.FOPIsMultipleSelection = element.attr(<string>attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;

                this.sc.FOPItemClicked = (evt) => { this.ItemClicked(this.sc, evt); }

                this.init();
            };


        }

        private init() {
            this.initPubSub();
            this.RefreshData();

        }

        private RefreshData() {
            this.RefreshFonts();
        }

        private RefreshFonts() {
            var __this = this;

            this.dataSvc
                .getAllByGrouping('Font', __this.sc.FOPGroup,  __this.authService.sessionId)
                .success(function (result: any) { __this.sc.FOPItemsList = result; })
                .error(function (err) { });
        }

        initPubSub = () => {

            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.FontsSelectedCleared,
                this.ClearSelectedItems.bind(this),
                undefined);
            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.InitFontsSelected,
                this.SetSelectedItems.bind(this),
                undefined);

            this.sc.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FontsSelectedCleared, this.ClearSelectedItems);
        }

        ClearSelectedItems = () => {
            var elms = $('input[type="checkbox"]');
            $(elms).prop('checked', false);
            this.sc.FOPSelectedItems = [];
        }

        SetSelectedItems = (ids : string) => {
            if (ids) {
                var parts = ids.split(',');
                this.sc.FOPSelectedItems = [];
                $.each(parts,(idx, val) => {
                    var elms = $('input[data-id="' + val + '"]');
                    $(elms[0]).prop('checked', true);
                    this.sc.FOPSelectedItems.push(val); 
                });
            }
        }

        ItemClicked = (scope: IFontPickerScope, evt: any) => {
            
            //now do stuff with the selected item
            var el = evt.currentTarget;
            var id = $(el).data('id');
            if ($(el).is(':checked')) {
                //check

                if (!scope.FOPIsMultipleSelection) {
                    //need to unselect anything that is currently selected
                    $.each(scope.FOPSelectedItems,(index) => {
                        var selid: any = scope.FOPSelectedItems[index];
                        var elms = $('input[data-id="' + selid + '"]');
                        $(elms[0]).prop('checked', false);
                    });
                    scope.FOPSelectedItems = [];

                }
 
                scope.FOPSelectedItems.push(id); 


            } else {
                //uncheck
                var index = scope.FOPSelectedItems.indexOf(id);
                scope.FOPSelectedItems.splice(index, 1);
            }
            

            this.radioPubSubSvc.publish(this.pubSubConstants.FontChanged, scope.FOPSelectedItems.join());
        };
    }

    export interface IFontPickerScope extends ng.IScope {
        FOPItemsList: Array<any>;
     
        FOPGroup: string;
        

        FOPItemClicked: Function;
        FOPSelectedItems: Array<any>;

        FOPIsMultipleSelection: boolean;
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFontPicker", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new FontPickerDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}



















