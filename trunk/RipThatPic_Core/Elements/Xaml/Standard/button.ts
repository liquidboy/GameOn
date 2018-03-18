import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { UserControl } from './user-control';

@Component({
    selector: 'xaml-button',
    template: `
        <h1>Button</h1>
    `,
})
export class Button extends UserControl {
    constructor() {
        super();
        console.log("Button.constructor");
    }
}