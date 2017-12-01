import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FlowComponent } from './components/flow/flow.component';
import { ShaderToyComponent } from './components/shadertoy/shadertoy.component';
import { GridRainboWaveComponent } from './components/gridrainbowave/gridrainbowave.component';
import { AbstractMountainsComponent } from './components/abstractmountains/abstractmountains.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        FlowComponent,
        ShaderToyComponent,
        GridRainboWaveComponent,
        AbstractMountainsComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'flow', component: FlowComponent },
            { path: 'shadertoy', component: ShaderToyComponent },
            { path: 'gridrainbowave', component: GridRainboWaveComponent },
            { path: 'abstractmountains', component: AbstractMountainsComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
