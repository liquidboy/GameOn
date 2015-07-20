module Application.Controllers {
    export class ConfigPageCtrl {
        EntityType: string = "page";
        Pages: Array<any>;
        SelectedItem: any;

        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants) {
            this.init();
        }

        DeleteItem = () => {

            var __this = this;

            this.dataSvc
                .delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping, __this.authService.sessionId)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedItem(); })
                .error(function (err: any) { alert('failure deleting..') });

        }

        ClearEntryFields = () => {
            this.InitSelectedItem();
        }

        private init() {
            this.InitSelectedItem();
            this.RefreshData();


            this.radioPubSubSvc.subscribe(this.pubSubConstants.FontChanged, this.FontChanged.bind(this), undefined);
            this.radioPubSubSvc.subscribe(this.pubSubConstants.FileStorageListSelectionsChanged, this.PictureChanged.bind(this), undefined);
            this.$scope.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FontChanged, __this.FontChanged);
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileStorageListSelectionsChanged, __this.PictureChanged);
        }

        private FontChanged(fonts: string) {
            this.SelectedItem.Fonts = fonts;
        }

        private PictureChanged(ids: string) {
            this.SelectedItem.BannerPicture = ids;
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll(__this.EntityType, __this.authService.sessionId)
                .success(function (result: any) { __this.Pages = result.Pages; })
                .error(function (err) { });
        }

        private InitSelectedItem() {
            this.UnSelect();
            this.SelectedItem = this.instanceFactory.getInstance("_object");
        }

        SaveItem = () => {

            var __this: any = this;

            this.dataSvc
                .save(__this.EntityType, __this.SelectedItem, __this.authService.sessionId)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedItem(); })
                .error(function (val) { alert('Failed saving item'); });

        }

        SelectItemRow = (model, event) => {
            this.UnSelect();

            var trElement = event.currentTarget;
            this.SelectedItem = jQuery.extend(true, {}, model);
            this.SelectedItem.NameIsReadOnly = true;
            this.SelectedItem.GroupingIsReadOnly = true;
            this.SelectedItem._Model = model;
            this.SelectedItem._Model.IsSelected = true;
            this.radioPubSubSvc.publish(this.pubSubConstants.InitFontsSelected, model.Fonts);
        }


        private UnSelect() {
            if (this.SelectedItem != undefined) {
                this.SelectedItem._Model.IsSelected = false;
                this.radioPubSubSvc.publish(this.pubSubConstants.ClearFontsSelected, undefined);
            }
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigPageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigPageCtrl]);
}