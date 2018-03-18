import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-control-template',
    template: `
        <h1>ControlTemplate</h1>
    `,
})
export class ControlTemplate {
    constructor() {
        console.log("ControlTemplate.constructor");
    }
}