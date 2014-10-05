app.directive('cstHeaderStrip', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/angularApp/partials/HeaderStrip.html',
        link: function (scope, element, attrs) {
            var menuItems = element.find("div");
            //menuItems.on('click', function () {
            //    menuItems.removeClass('active');
            //    $(this).addClass('active');
            //});

            
        }
    };
});