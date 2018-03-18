import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-data-template',
    template: `
        <h1>DataTemplate</h1>
    `,
})
export class DataTemplate {
    constructor() {
        console.log("DataTemplate.constructor");
    }
}