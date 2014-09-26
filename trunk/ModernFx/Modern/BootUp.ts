/// <reference path="DataLoader.ts"/>

class BootUp {

    public DataLoader: DataLoader;


    constructor(theme: string, rootUI: any, headUI: any) {

        this.DataLoader = new DataLoader();
    }


    public Start() {

    }

    public Stop() {

    }

    public Unload() {

    }

    private _getQueryVariable(variable: string) { var query = window.location.search.substring(1); var vars = query.split('&'); for (var i = 0; i < vars.length; i++) { var pair = vars[i].split('='); if (decodeURIComponent(pair[0]) == variable) { return decodeURIComponent(pair[1]); } } }



}



window.onload = StartBootup;
window.onunload = StopBootup;


var _bootup: BootUp;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();

    //disable text content selection document wide, fixes chrome issue
    document.onselectstart = function () { return false; } // ie
    document.onmousedown = function () { return false; } // mozilla

}


function StopBootup() {
    _bootup.Stop();
    _bootup.Unload();
}