var Application;
(function (Application) {
    var Services;
    (function (Services) {
        var RadioPubSubSvc = (function () {
            //public injection(): Array<any> {
            //    return [
            //        () => { return [RadioPubSubSvc]; }
            //    ];
            //}
            function RadioPubSubSvc($http, $location) {
                var _this = this;
                this._refCount = 0;
                this.publish = function (topic, message) {
                    _this._radio(topic).broadcast(message);
                };
                this.subscribe = function (topic, handler, scope) {
                    _this._refCount++;
                    _this._radio(topic).subscribe(handler);
                    // if we have a scope then unsubscribe the handler
                    // when the scope is destroyed
                    var __this = _this;
                    if (scope && scope.$on) {
                        scope.$on('$destroy', function () {
                            __this.unsubscribe(topic, handler);
                        });
                    }
                };
                this.unsubscribe = function (topic, handler) {
                    _this._refCount--;
                    _this._radio(topic).unsubscribe(handler);
                };
                this.http = $http;
                this.location = $location;
                var localWindow = window;
                //radio is injected in the app in the bootstrapapp
                this._radio = localWindow['radio'];
            }
            return RadioPubSubSvc;
        }());
        Services.RadioPubSubSvc = RadioPubSubSvc;
        var myapp = angular.module('bootstrapApp');
        myapp.service("radioPubSubSvc", ["$http", "$location", RadioPubSubSvc]); //($http, $location) => new RadioPubSubSvc($http, $location)]);
    })(Services = Application.Services || (Application.Services = {}));
})(Application || (Application = {}));
//# sourceMappingURL=radioPubSubService.js.map