var Application;
(function (Application) {
    var Constants;
    (function (Constants) {
        var PubSubConstants = (function () {
            function PubSubConstants() {
                this.MessageSample001 = "Message1";
                this.MessageSample002 = "Message2";
            }
            return PubSubConstants;
        })();
        Constants.PubSubConstants = PubSubConstants;
        var myapp = angular.module('bootstrapApp');
        myapp.constant("pubSubConstants", new PubSubConstants());
    })(Constants = Application.Constants || (Application.Constants = {}));
})(Application || (Application = {}));
//# sourceMappingURL=Constants.js.map