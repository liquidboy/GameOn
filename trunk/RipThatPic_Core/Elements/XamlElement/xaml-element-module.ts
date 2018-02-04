import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { XamlElement } from './xaml-element';


@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule],
    declarations: [XamlElement],
    entryComponents: [XamlElement],
})

export class XamlElementModule {

    ngDoBootstrap() { }

}