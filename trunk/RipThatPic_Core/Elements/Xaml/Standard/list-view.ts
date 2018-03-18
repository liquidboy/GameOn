import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-list-view',
    template: `
        <h1>ListView</h1>
    `,
})
export class ListView {
    constructor() {
        console.log("ListView.constructor");
    }
}