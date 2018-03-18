import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-date-picker',
    template: `
        <h1>DatePicker</h1>
    `,
})
export class DatePicker {
    constructor() {
        console.log("DatePicker.constructor");
    }
}