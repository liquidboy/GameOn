import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-progress-ring',
    template: `
        <h1>ProgressRing</h1>
    `,
})
export class ProgressRing {
    constructor() {
        console.log("ProgressRing.constructor");
    }
}