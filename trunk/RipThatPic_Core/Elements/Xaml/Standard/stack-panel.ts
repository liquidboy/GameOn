import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-stack-panel',
    template: `
        <h1>StackPanel</h1>
    `,
})
export class StackPanel {
    constructor() {
        console.log("StackPanel.constructor");
    }
}