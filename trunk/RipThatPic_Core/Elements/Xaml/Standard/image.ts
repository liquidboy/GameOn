import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-image',
    template: `
        <h1>Image</h1>
    `,
})
export class Image {
    constructor() {
        console.log("Image.constructor");
    }
}