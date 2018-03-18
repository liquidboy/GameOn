import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-toggle-switch',
    template: `
        <h1>ToggleSwitch</h1>
    `,
})
export class ToggleSwitch {
    constructor() {
        console.log("ToggleSwitch.constructor");
    }
}