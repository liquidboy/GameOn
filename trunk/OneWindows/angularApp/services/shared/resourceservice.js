app.factory('resourceSvc', ['$http', 'serviceHelperSvc', 'userProfileSvc', function ($http, serviceHelper, userProfileSvc) {

    var Token = serviceHelper.AuthorizationToken;
    var Account = serviceHelper.Account;

    var buildFormData = function (formData) {
        var dataString = '';
        for (var prop in formData) {
            if (formData.hasOwnProperty(prop)) {
                dataString += (prop + '=' + formData[prop] + '&');
            }
        }
        return dataString.slice(0, dataString.length - 1);
    };

    return {
        something: function (param) {
            return {};
        }
    };
}]);