/// <reference path="DataLoader.ts"/>
var BootUp = (function () {
    function BootUp(theme, rootUI, headUI) {
        this.DataLoader = new DataLoader();
    }
    BootUp.prototype.Start = function () {
    };

    BootUp.prototype.Stop = function () {
    };

    BootUp.prototype.Unload = function () {
    };

    BootUp.prototype._getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };
    return BootUp;
})();

window.onload = StartBootup;
window.onunload = StopBootup;

var _bootup;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();

    //disable text content selection document wide, fixes chrome issue
    document.onselectstart = function () {
        return false;
    };
    document.onmousedown = function () {
        return false;
    };
}

function StopBootup() {
    _bootup.Stop();
    _bootup.Unload();
}
//# sourceMappingURL=BootUp.js.map
