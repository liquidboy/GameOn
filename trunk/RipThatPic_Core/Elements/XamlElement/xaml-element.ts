import {
    Component,
    ViewEncapsulation,
} from '@angular/core';

interface IXamlElement {

    text: string;
    checked: boolean;
}

@Component({
    selector: 'xaml-element',
    template: `
        <h1>xamlelement</h1>
    `,
    styles: [`

    `],
    encapsulation: ViewEncapsulation.Native

})
export class XamlElement {
    
}