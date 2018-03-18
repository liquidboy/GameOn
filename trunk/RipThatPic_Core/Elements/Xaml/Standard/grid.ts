import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-grid',
    template: `
        <h1>Grid</h1>
    `,
})
export class Grid {
    constructor() {
        console.log("Grid.constructor");
    }
}