import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';
import { createNgElementConstructor, NgElementConfig, NgElementConstructor, getConfigFromComponentFactory,  } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs/Subject';
import { XamlElement } from './xaml-element';

@NgModule({
    //bootstrap: [XamlElement],
    imports: [
        BrowserModule
    ],
    providers: [
        
    ],
    declarations: [XamlElement],
    entryComponents: [XamlElement]
})
export class XamlElementModule {
    constructor(private moduleRef: NgModuleRef<any>) {
        console.log("xaml-element.ts->XamlElementModule.constructor");
        console.log(moduleRef);

        const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory<XamlElement>(XamlElement);
        console.log(componentFactory);
        const ngElementConfig = getConfigFromComponentFactory(componentFactory, moduleRef.injector);
        const ngElementCtor = createNgElementConstructor(ngElementConfig); 
        console.log(ngElementCtor);
   
        customElements.define(componentFactory.selector, ngElementCtor);
    }
    ngDoBootstrap() {
        console.log("xaml-element.module.ts->XamlElementModule.ngDoBootstrap");
    }
    
}