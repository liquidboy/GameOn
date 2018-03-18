import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-column-definition-collection',
    template: `
        <h1>ColumnDefinitionCollection</h1>
    `,
})
export class ColumnDefinitionCollection {
    constructor() {
        console.log("ColumnDefinitionCollection.constructor");
    }
}