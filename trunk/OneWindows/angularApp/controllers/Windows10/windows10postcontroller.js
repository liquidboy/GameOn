app.controller('Windows10PostCtrl', ['$scope', '$routeParams', 'resourceSvc', function ($scope, $routeParams, resourceSvc) {
    init();
    function init() {
        loadResources();
    }
    function loadResources() {
        $scope.postId = $routeParams.postId;
    }
}]);