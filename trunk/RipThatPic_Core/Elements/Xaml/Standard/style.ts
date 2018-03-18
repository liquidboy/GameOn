import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-style',
    template: `
        <h1>Style</h1>
    `,
})
export class Style {
    constructor() {
        console.log("Style.constructor");
    }
}