import {
    Component, ComponentFactory, NgModuleRef, NgModule, CompilerFactory,
    NgModuleFactory, NgModuleFactoryLoader, Type, destroyPlatform
} from '@angular/core';
import { createCustomElement, NgElementConfig, NgElementConstructor, NgElementStrategyFactory  } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XamlElement } from './Xaml/xaml-element';
import { BindingBase } from './Xaml/Standard/binding-base';
import { Border } from './Xaml/Standard/border';
import { Button } from './Xaml/Standard/button';
import { ColumnDefinition } from './Xaml/Standard/column-definition';
import { ColumnDefinitionCollection } from './Xaml/Standard/column-definition-collection';
import { ComboBox } from './Xaml/Standard/combo-box';
import { ContentPresenter } from './Xaml/Standard/content-presenter';
import { ControlTemplate } from './Xaml/Standard/control-template';
import { DataTemplate } from './Xaml/Standard/data-template';
import { DataTemplateSelector } from './Xaml/Standard/data-template-selector';
import { DatePicker } from './Xaml/Standard/date-picker';
import { Grid } from './Xaml/Standard/grid';
import { Image } from './Xaml/Standard/image';
import { ListView } from './Xaml/Standard/list-view';
import { ProgressBar } from './Xaml/Standard/progress-bar';
import { ProgressRing } from './Xaml/Standard/progress-ring';
import { ResourceDictionary } from './Xaml/Standard/resource-dictionary';
import { RowDefinition } from './Xaml/Standard/row-definition';
import { RowDefinitionCollection } from './Xaml/Standard/row-definition-collection';
import { Setter } from './Xaml/Standard/setter';
import { Slider } from './Xaml/Standard/slider';
import { StackPanel } from './Xaml/Standard/stack-panel';
import { Style } from './Xaml/Standard/style';
import { TextBlock } from './Xaml/Standard/text-block';
import { TextBox } from './Xaml/Standard/text-box';
import { TimePicker } from './Xaml/Standard/time-picker';
import { ToggleSwitch } from './Xaml/Standard/toggle-switch';
import { UserControl } from './Xaml/Standard/user-control';
import { WebView } from './Xaml/Standard/web-view';
import { Binding } from './Xaml/Standard/binding';

@NgModule({
    //bootstrap: [XamlElement],
    imports: [
        BrowserModule
    ],
    providers: [
        
    ],
    declarations: [XamlElement,
        Binding, BindingBase, Border, Button, ColumnDefinition,
        ColumnDefinitionCollection, ComboBox, ContentPresenter, ControlTemplate,
        DataTemplate, DataTemplateSelector, DatePicker, Grid, Image, ListView,
        ProgressBar, ProgressRing, ResourceDictionary, RowDefinition, RowDefinitionCollection,
        Setter, Slider, StackPanel, Style, TextBlock, TextBox, TimePicker, ToggleSwitch,
        UserControl, WebView
    ],
    entryComponents: [XamlElement,
        Binding, BindingBase, Border, Button, ColumnDefinition,
        ColumnDefinitionCollection, ComboBox, ContentPresenter, ControlTemplate,
        DataTemplate, DataTemplateSelector, DatePicker, Grid, Image, ListView,
        ProgressBar, ProgressRing, ResourceDictionary, RowDefinition, RowDefinitionCollection,
        Setter, Slider, StackPanel, Style, TextBlock, TextBox, TimePicker, ToggleSwitch,
        UserControl, WebView
    ]
})
export class ElementsModule {
    constructor(private moduleRef: NgModuleRef<any>) {
        this.register<XamlElement>(this.moduleRef, XamlElement);

        this.register<Binding>(this.moduleRef, Binding);
        this.register<BindingBase>(this.moduleRef, BindingBase);
        this.register<Border>(this.moduleRef, Border);
        this.register<Button>(this.moduleRef, Button);
        this.register<ColumnDefinition>(this.moduleRef, ColumnDefinition);
        this.register<ColumnDefinitionCollection>(this.moduleRef, ColumnDefinitionCollection);
        this.register<ComboBox>(this.moduleRef, ComboBox);
        this.register<ContentPresenter>(this.moduleRef, ContentPresenter);
        this.register<ControlTemplate>(this.moduleRef, ControlTemplate);
        this.register<DataTemplate>(this.moduleRef, DataTemplate);
        this.register<DataTemplateSelector>(this.moduleRef, DataTemplateSelector);
        this.register<DatePicker>(this.moduleRef, DatePicker);
        this.register<Grid>(this.moduleRef, Grid);
        this.register<Image>(this.moduleRef, Image);
        this.register<ListView>(this.moduleRef, ListView);
        this.register<ProgressBar>(this.moduleRef, ProgressBar);
        this.register<ProgressRing>(this.moduleRef, ProgressRing);
        this.register<ResourceDictionary>(this.moduleRef, ResourceDictionary);
        this.register<RowDefinition>(this.moduleRef, RowDefinition);
        this.register<RowDefinitionCollection>(this.moduleRef, RowDefinitionCollection);
        this.register<Setter>(this.moduleRef, Setter);
        this.register<Slider>(this.moduleRef, Slider);
        this.register<StackPanel>(this.moduleRef, StackPanel);
        this.register<Style>(this.moduleRef, Style);
        this.register<TextBlock>(this.moduleRef, TextBlock);
        this.register<TextBox>(this.moduleRef, TextBox);
        this.register<TimePicker>(this.moduleRef, TimePicker);
        this.register<ToggleSwitch>(this.moduleRef, ToggleSwitch);
        this.register<WebView>(this.moduleRef, WebView);
    }
    ngDoBootstrap() {

    }
    register<T>(moduleRef: NgModuleRef<any>, component: Type<T>) {
        //console.log(moduleRef);
        const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory<T>(component);
        //console.log(componentFactory);
        
        // const ngElementConfig = new ngElementConfig(); //getConfigFromComponentFactory(componentFactory, moduleRef.injector);
        const ngElementCtor = createCustomElement(component, { injector: moduleRef.injector });
        //console.log(ngElementCtor);
        customElements.define(componentFactory.selector, ngElementCtor);
    }
}