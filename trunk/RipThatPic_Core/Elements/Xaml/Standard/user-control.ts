import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-user-control',
    template: `
        <h1>UserControl</h1>
    `,
})
export class UserControl {
    constructor() {
        console.log("UserControl.constructor");
    }
}