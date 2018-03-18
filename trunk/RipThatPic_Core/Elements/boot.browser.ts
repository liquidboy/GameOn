import 'reflect-metadata';
import 'zone.js';
import 'bootstrap';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ElementsModule } from './elements.module';
import { DashboardModule } from './dashboard.module';
import { CanvasModule } from './canvas.module';
import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';




@NgModule({
    imports: [
        ElementsModule,
        DashboardModule,
        CanvasModule
    ],
    providers: [],
    declarations: [],
    entryComponents: []
})
export class AllModules {
    constructor() {
        
    }
    ngDoBootstrap() {

    }
}
const modulePromise2 = platformBrowserDynamic().bootstrapModule(AllModules);