var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var RadioPubSubSvc = (function () {
            function RadioPubSubSvc($http, $location) {
                this.publish = function (topic, message) {
                };
                this.subscribe = function (topic, handler) {
                };
                this.ubsubscribe = function (topic, handler) {
                };
                this.http = $http;
                this.location = $location;
            }
            RadioPubSubSvc.prototype.injection = function () {
                return [
                    function () {
                        return [RadioPubSubSvc];
                    }
                ];
            };
            return RadioPubSubSvc;
        })();
        Services.RadioPubSubSvc = RadioPubSubSvc;
        var myapp = angular.module('bootstrapApp');
        myapp.service("radioPubSubSvc", ["$http", "$location", function ($http, $location) { return new RadioPubSubSvc($http, $location); }]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=radioPubSubService.js.map