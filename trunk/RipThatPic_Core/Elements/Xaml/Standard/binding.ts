import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-binding',
    template: `
        <h1>Binding</h1>
    `,
})
export class Binding {
    constructor() {
        console.log("Binding.constructor");
    }
}