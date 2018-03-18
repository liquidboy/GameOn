import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xaml-slider',
    template: `
        <h1>Slider</h1>
    `,
})
export class Slider {
    constructor() {
        console.log("Slider.constructor");
    }
}