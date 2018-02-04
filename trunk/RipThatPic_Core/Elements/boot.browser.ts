import 'zone.js/dist/zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerAsCustomElements } from '@angular/elements';

import { XamlElementModule } from './XamlElement/xaml-element-module';
import { XamlElement } from './XamlElement/xaml-element';



registerAsCustomElements([
    XamlElement
], () =>
        platformBrowserDynamic().bootstrapModule(XamlElementModule)

);