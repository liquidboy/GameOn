import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';

interface IXamlElement {
    text: string;
    checked: boolean;
}

@Component({
    selector: 'xaml-element',
    template: `
        <h1>xamlelement</h1>
        <h2>where the fuck are you</h2>
    `,
})
export class XamlElement {
    @Input() name: string = 'World!';
    constructor() {
        console.log("XamlElement.constructor");
    }
}