import 'reflect-metadata';
import 'zone.js';
import 'bootstrap';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { XamlElementModule } from './XamlElement/xaml-element.module';

const modulePromise = platformBrowserDynamic().bootstrapModule(XamlElementModule);
