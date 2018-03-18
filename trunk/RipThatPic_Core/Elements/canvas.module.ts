import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';
import { createCustomElement, NgElementConfig, NgElementConstructor } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs/Subject';

import { XamlCanvas } from './Canvas/xaml-canvas';

@NgModule({
    //bootstrap: [XamlElement],
    imports: [
        BrowserModule
    ],
    providers: [
        
    ],
    declarations: [ XamlCanvas ],
    entryComponents: [ XamlCanvas ]
})
export class CanvasModule {
    constructor(private moduleRef: NgModuleRef<any>) {
        this.register<XamlCanvas>(this.moduleRef, XamlCanvas);
    }
    ngDoBootstrap() {

    }
    register<T>(moduleRef: NgModuleRef<any>, component: Type<T>) {
        //console.log(moduleRef);
        const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory<T>(component);
        //console.log(componentFactory);
        // const ngElementConfig = getConfigFromComponentFactory(componentFactory, moduleRef.injector);
        const ngElementCtor = createCustomElement(component, { injector: moduleRef.injector });
        //console.log(ngElementCtor);
        customElements.define(componentFactory.selector, ngElementCtor);
    }
}