import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-dashboard',
    template: `
        <div style="width:100px; height:100px; background-color:red">{{name}}</div>
    `,
})
export class XamlDashboard {
    @Input() name: string = 'World!';
    constructor() {
        console.log("XamlDashboard.constructor");
    }
}