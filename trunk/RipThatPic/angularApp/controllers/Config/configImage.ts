module Application.Controllers {
    export class ConfigImageCtrl {
        EntityType: string = "image";
        ItemsList: Array<any>;
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

            this.$scope.$on('$destroy', this.destructor);

            this.init();
        }

        destructor = () => {
            var __this = this;
            window['tinymce'].EditorManager.execCommand('mceRemoveEditor', true, 'taDetails');

            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileStorageListSelectionsChanged, __this.PictureChanged);
        }

        private PictureChanged(ids: string) {
            this.SelectedItem.FileStorageDisplayId = ids;
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
            this.radioPubSubSvc.subscribe(this.pubSubConstants.FileStorageListSelectionsChanged, this.PictureChanged.bind(this), undefined);
            this.InitSelectedItem();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll(__this.EntityType, __this.authService.sessionId)
                .success(function (result: any) { __this.ItemsList = result; })
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
        }


        private UnSelect() { if (this.SelectedItem != undefined) this.SelectedItem._Model.IsSelected = false; }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigImageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigImageCtrl]);
}