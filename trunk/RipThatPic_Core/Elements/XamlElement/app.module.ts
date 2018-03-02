//import { Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory, NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform } from '@angular/core';
//import { createNgElementConstructor, NgElementDelegateFactory } from '@angular/elements';
//import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { XamlElement } from './xaml-element';

//export const entryComponents = [
//    XamlElement
//];

//@NgModule({
//    imports: [
//        BrowserAnimationsModule,
//        BrowserModule
//    ],
//    providers: [
//        { provide: 'TEST_VALUE', useValue: 'TEST' },
//    ],
//    declarations: [XamlElement],
//    entryComponents,
//})
//export class AppModule {
//    /** Delegate factory to use for newly created elements. */
//    delegateFactory = new NgElementDelegateFactory<any>(this.moduleRef.injector);

//    ngDoBootstrap() { console.log("AppModule.ngDoBootstrap"); }
//    constructor(private moduleFactoryLoader: NgModuleFactoryLoader, private moduleRef: NgModuleRef<any>) {
//        console.log(moduleRef);
//        //const NgElement = createNgElementConstructor<any, any>(componentFactory, {
//        //    delegateFactory: this.delegateFactory
//        //});
//    }

//    private getElementComponentFactory(
//        moduleRef: NgModuleRef<any>): ComponentFactory<string> {
//        const resolver = moduleRef.componentFactoryResolver;
//        const customElement = moduleRef.instance.customElement;

//        return resolver.resolveComponentFactory(customElement);
//    }
//}

import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';
import { createNgElementConstructor, NgElementConfig, NgElementConstructor, getConfigFromComponentFactory,  } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs/Subject';
import { XamlElement } from './xaml-element';
// import { NgElementDelegateFactoryBase, NgElementDelegateBase, NgElementDelegateEvent } from '@angular/elements/src/element-delegate';


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
export class AppModule {
    //_delegateFactory: NgElementDelegateFactory<any>;
    //_delegateFactory: XamlElementDelegateFactory;

    _ngElementCtor: NgElementConstructor<any>;
    _componentFactory: ComponentFactory<XamlElement>;

    constructor(private moduleRef: NgModuleRef<any>) {
        console.log("app.module.ts->AppModule.constructor");
        console.log(moduleRef);

        //this._delegateFactory = new NgElementDelegateFactory<any>(this.moduleRef.injector);
        //this._delegateFactory = new XamlElementDelegateFactory();
        //console.log(this._delegateFactory);


        this._componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory<XamlElement>(XamlElement);
        console.log(this._componentFactory);
        const ngElementConfig = getConfigFromComponentFactory(this._componentFactory, moduleRef.injector);
        this._ngElementCtor = createNgElementConstructor(ngElementConfig); 
        console.log(this._ngElementCtor);
        
        //let el: any = this._componentFactory.create(this.moduleRef.injector);
        //console.log(el);

        customElements.define(this._componentFactory.selector, this._ngElementCtor);
    }
    ngDoBootstrap() {
        console.log("app.module.ts->AppModule.ngDoBootstrap");

        //this._ngElementCtor = createNgElementConstructor(this._componentFactory, { delegateFactory: this._delegateFactory });
        //console.log(this._ngElementCtor);
        //customElements.define(this._componentFactory.selector, this._ngElementCtor);
    }
    
}




//class XamlElementDelegate implements NgElementDelegateBase<any> {
//    connectedElement: HTMLElement | null = null;
//    disconnectCalled = false;
//    inputs = new Map<string, any>();

//    events = new Subject<NgElementDelegateEvent>();

//    connect(element: HTMLElement): void {
//        console.log("XamlElementDelegate.connect");
//        this.connectedElement = element;
//    }

//    disconnect(): void {
//        this.disconnectCalled = true;
//    }

//    getInputValue(propName: string): any {
//        return this.inputs.get(propName);
//    }

//    setInputValue(propName: string, value: string): void {
//        this.inputs.set(propName, value);
//    }
//}
//class XamlElementDelegateFactory implements NgElementDelegateFactoryBase {
//    xamlElementDelegate = new XamlElementDelegate();

//    create(componentFactory: ComponentFactory<any>): NgElementDelegateBase<any> {
//        return this.xamlElementDelegate;
//    }
//}
