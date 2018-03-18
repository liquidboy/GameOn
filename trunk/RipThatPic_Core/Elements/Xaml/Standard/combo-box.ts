import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { UserControl } from './user-control';

@Component({
    selector: 'xaml-combo-box',
    template: `
        <h1>ComboBox</h1>
    `,
})
export class ComboBox extends UserControl {
    constructor() {
        super();
        console.log("ComboBox.constructor");
    }
}