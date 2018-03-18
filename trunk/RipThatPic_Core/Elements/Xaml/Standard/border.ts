import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-border',
    template: `
        <h1>Border</h1>
    `,
})
export class Border {
    constructor() {
        console.log("Border.constructor");
    }
}