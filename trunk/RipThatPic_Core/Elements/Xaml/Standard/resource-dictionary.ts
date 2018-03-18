import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-resource-dictionary',
    template: `
        <h1>ResourceDictionary</h1>
    `,
})
export class ResourceDictionary {
    constructor() {
        console.log("ResourceDictionary.constructor");
    }
}