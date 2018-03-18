import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-text-block',
    template: `
        <h1>TextBlock</h1>
    `,
})
export class TextBlock {
    constructor() {
        console.log("TextBlock.constructor");
    }
}