import 'reflect-metadata';
import 'zone.js';
import 'bootstrap';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ElementsModule } from './elements.module';
import { DashboardModule } from './dashboard.module';

const modulePromise = platformBrowserDynamic().bootstrapModule(ElementsModule);
const modulePromise2 = platformBrowserDynamic().bootstrapModule(DashboardModule);
