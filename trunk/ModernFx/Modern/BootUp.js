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
