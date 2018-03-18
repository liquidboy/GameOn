import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-progress-bar',
    template: `
        <h1>ProgressBar</h1>
    `,
})
export class ProgressBar {
    constructor() {
        console.log("ProgressBar.constructor");
    }
}