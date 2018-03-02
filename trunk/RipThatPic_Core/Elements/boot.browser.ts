import 'reflect-metadata';
import 'zone.js';
import 'bootstrap';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ElementsModule } from './elements.module';

const modulePromise = platformBrowserDynamic().bootstrapModule(ElementsModule);
