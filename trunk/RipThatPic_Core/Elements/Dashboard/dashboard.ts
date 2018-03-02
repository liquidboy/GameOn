import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'geko-dashboard',
    template: `
        <div style="width:100px; height:100px; background-color:red">{{name}}</div>
    `,
})
export class GekoDashboard {
    @Input() name: string = 'World!';
    constructor() {
        console.log("GekoDashboard.constructor");
    }
}