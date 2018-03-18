import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-row-definition-collection',
    template: `
        <h1>RowDefinitionCollection</h1>
    `,
})
export class RowDefinitionCollection {
    constructor() {
        console.log("RowDefinitionCollection.constructor");
    }
}