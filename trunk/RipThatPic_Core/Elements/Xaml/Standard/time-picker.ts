import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-time-picker',
    template: `
        <h1>TimePicker</h1>
    `,
})
export class TimePicker {
    constructor() {
        console.log("TimePicker.constructor");
    }
}