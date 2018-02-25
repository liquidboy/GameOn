import 'reflect-metadata';
import 'zone.js';
import 'bootstrap';
//import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './XamlElement/app.module';

////import { ComponentFactory } from '@angular/core';
////import { createNgElementConstructor, NgElementDelegateFactory, NgElementConstructor } from '@angular/elements';
////import { XamlElement } from './XamlElement/xaml-element';

//if (module.hot) {
//    module.hot.accept();
//    module.hot.dispose(() => {
//        // Before restarting the app, we create a new root element and dispose the old one
//        const oldRootElem = document.querySelector('app');
//        const newRootElem = document.createElement('app');
//        oldRootElem!.parentNode!.insertBefore(newRootElem, oldRootElem);
//        modulePromise.then(appModule => appModule.destroy());
//    });
//} else {
//    enableProdMode();
//}

// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.

const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);

////const modulePromise = platformBrowserDynamic()
////    .bootstrapModule(AppModule)
////    .then(moduleRef => {
////        let _delegateFactory: NgElementDelegateFactory<any>;
////        let _ngElementCtor: NgElementConstructor<any>;
////        let _componentFactory: ComponentFactory<XamlElement>;

////        console.log(moduleRef);
////        _delegateFactory = new NgElementDelegateFactory<any>(moduleRef.injector);
////        console.log(_delegateFactory);
////        _componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(XamlElement);
////        console.log(_componentFactory);
////        _ngElementCtor = createNgElementConstructor(_componentFactory, { delegateFactory: _delegateFactory });
////        console.log(_ngElementCtor);
////        customElements.define(_componentFactory.selector, _ngElementCtor);

////    });
