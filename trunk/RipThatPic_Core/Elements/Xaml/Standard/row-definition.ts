import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-row-definition',
    template: `
        <h1>RowDefinition</h1>
    `,
})
export class RowDefinition {
    constructor() {
        console.log("RowDefinition.constructor");
    }
}