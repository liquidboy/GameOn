var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var InstanceFactory = (function () {
            function InstanceFactory($location) {
                this.location = $location;
            }
            InstanceFactory.prototype.injection = function () {
                return [
                    function () { return [InstanceFactory]; }
                ];
            };
            InstanceFactory.prototype.getInstance = function (instanceName) {
                var obj = {};
                if (instanceName == "_object")
                    obj = {
                        Name: "",
                        NameIsReadOnly: false,
                        LongName: "",
                        Grouping: "",
                        GroupingIsReadOnly: false,
                        Color: "",
                        DisplayId: "",
                        IsSelected: false,
                        _Model: {}
                    };
                return obj;
            };
            return InstanceFactory;
        })();
        Services.InstanceFactory = InstanceFactory;
        var myapp = angular.module('bootstrapApp');
        myapp.service("instanceFactory", ["$location", function ($location) { return new InstanceFactory($location); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
