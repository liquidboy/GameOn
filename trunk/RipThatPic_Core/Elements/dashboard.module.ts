import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';
import { createCustomElement, NgElementConfig, NgElementConstructor } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XamlDashboard } from './Dashboard/xaml-dashboard';

@NgModule({
    //bootstrap: [XamlElement],
    imports: [
        BrowserModule
    ],
    providers: [
        
    ],
    declarations: [XamlDashboard],
    entryComponents: [XamlDashboard]
})
export class DashboardModule {
    constructor(private moduleRef: NgModuleRef<any>) {
        this.register<XamlDashboard>(this.moduleRef, XamlDashboard);
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