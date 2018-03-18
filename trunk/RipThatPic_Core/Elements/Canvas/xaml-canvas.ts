import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-canvas',
    template: `
        <h1>xaml canvas</h1>
    `,
})
export class XamlCanvas{
    @Input() name: string = 'World!';
    constructor() {
        console.log("XamlCanvas.constructor");
    }
}