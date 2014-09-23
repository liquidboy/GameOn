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