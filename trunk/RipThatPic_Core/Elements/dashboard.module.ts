import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';
import { createNgElementConstructor, NgElementConfig, NgElementConstructor, getConfigFromComponentFactory,  } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs/Subject';
import { GekoDashboard } from './Dashboard/dashboard';

@NgModule({
    //bootstrap: [XamlElement],
    imports: [
        BrowserModule
    ],
    providers: [
        
    ],
    declarations: [GekoDashboard],
    entryComponents: [GekoDashboard]
})
export class DashboardModule {
    constructor(private moduleRef: NgModuleRef<any>) {
        this.register<GekoDashboard>(this.moduleRef, GekoDashboard);
    }
    ngDoBootstrap() {
    }
    register<T>(moduleRef: NgModuleRef<any>, component: Type<T>) {
        //console.log(moduleRef);
        const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory<T>(component);
        //console.log(componentFactory);
        const ngElementConfig = getConfigFromComponentFactory(componentFactory, moduleRef.injector);
        const ngElementCtor = createNgElementConstructor(ngElementConfig);
        //console.log(ngElementCtor);
        customElements.define(componentFactory.selector, ngElementCtor);
    }
}