///<reference path="../scripts/typings/angularjs/angular.d.ts" />
///<reference path="../scripts/typings/angularjs/angular-route.d.ts" />
var UserNotifications;
(function (UserNotifications) {
    var Controller = (function () {
        function Controller($scope) {
            $scope.statusText = "Hello from TypeScript + AngularJS";
        }
        return Controller;
    })();
    UserNotifications.Controller = Controller;
})(UserNotifications || (UserNotifications = {}));
//# sourceMappingURL=UserNotifications.js.map
