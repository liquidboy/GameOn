app.directive('resourceActivityList', function () {
    return {
        restrict: 'E',
        templateUrl: '/angularApp/directives/activities/ResourceActivityList.html',
        scope: {
            activities: "=activities"
        }
    };

});