import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-web-view',
    template: `
        <h1>WebView</h1>
    `,
})
export class WebView {
    constructor() {
        console.log("WebView.constructor");
    }
}