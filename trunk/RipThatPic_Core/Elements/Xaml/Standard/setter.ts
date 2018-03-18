import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-setter',
    template: `
        <h1>Setter</h1>
    `,
})
export class Setter {
    constructor() {
        console.log("Setter.constructor");
    }
}