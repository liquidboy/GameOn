import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-data-template-selector',
    template: `
        <h1>DataTemplateSelector</h1>
    `,
})
export class DataTemplateSelector {
    constructor() {
        console.log("DataTemplateSelector.constructor");
    }
}