import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-binding-base',
    template: `
        <h1>BindingBase</h1>
    `,
})
export class BindingBase {
    constructor() {
        console.log("Binding.constructor");
    }
}