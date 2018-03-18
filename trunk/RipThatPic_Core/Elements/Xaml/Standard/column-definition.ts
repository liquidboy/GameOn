import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-column-definition',
    template: `
        <h1>ColumnDefinition</h1>
    `,
})
export class ColumnDefinition {
    constructor() {
        console.log("ColumnDefinition.constructor");
    }
}