import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-content-presenter',
    template: `
        <h1>ContentPresenter</h1>
    `,
})
export class ContentPresenter {
    constructor() {
        console.log("ContentPresenter.constructor");
    }
}