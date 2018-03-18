import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-text-box',
    template: `
        <h1>TextBox</h1>
    `,
})
export class TextBox {
    constructor() {
        console.log("TextBox.constructor");
    }
}