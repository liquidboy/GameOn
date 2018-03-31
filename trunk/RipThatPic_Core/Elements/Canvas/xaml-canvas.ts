import { Component, Input, NgModule, ViewEncapsulation, ViewChild, ElementRef, SimpleChanges, OnChanges,AfterViewInit } from '@angular/core';

@Component({
    selector: 'xaml-canvas',
    template: `
        <canvas #rootElement></canvas>
        {{tablesrc}}
        <span #contentElement [hidden]="true"><ng-content></ng-content></span>
    `,
})
export class XamlCanvas implements OnChanges, AfterViewInit{

    // note: these are projected properties from the original root element 'xaml-canvas' and are case sensitive, KEEP THEM LOWERCASE OR SPEND HOURS WORKING OUT BUGS
    @Input() tablesrc: string;
    @Input() contenttype: ContentType = ContentType.None;

    @ViewChild("rootElement") rootElement: ElementRef;
    @ViewChild("contentElement") contentElement: ElementRef;

    private tableData: any;

    constructor() {
        console.log("XamlCanvas.constructor");

        // note: too early to get to this stuff
        // console.log(this.rootElement);
        // console.log(this.contentElement);
    }

    ngAfterViewInit() {
        this.tableData = JSON.parse(this.contentElement.nativeElement.innerText);
        console.log(this.tableData);
        console.log(this.tablesrc);
        console.log(this.contenttype);
        console.log(this.contenttype === ContentType.Datagrid_JSON);
    }

    ngOnChanges(changes: SimpleChanges): any {
        if ('tablesrc' in changes) {
            if (changes.tablesrc.previousValue !== changes.tablesrc.currentValue) {
                console.log(`tablesrc change detected : ${changes.tablesrc.currentValue}`);
            }
        }

        if ('contenttype' in changes) {
            switch (changes.contenttype.currentValue.toLowerCase()) {
                case 'datagrid-json': this.contenttype = ContentType.Datagrid_JSON; break;
                case 'xaml': this.contenttype = ContentType.XAML; break;
                default: this.contenttype = ContentType.None;
            }
        }
        console.log(changes);
    }
}

enum ContentType {
    Datagrid_JSON = 1,
    None,
    XAML
}