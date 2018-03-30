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
    @Input() name: string = 'World!';
    @Input() tablesrc: string;
    @ViewChild("rootElement") rootElement: ElementRef;
    @ViewChild("contentElement") contentElement: ElementRef;

    private tableData: any;

    constructor() {
        console.log("XamlCanvas.constructor");
        //console.log(this.rootElement);
        //console.log(this.contentElement);
    }

    ngAfterViewInit() {
        this.tableData = JSON.parse(this.contentElement.nativeElement.innerText);
        console.log(this.tableData);
    }

    ngOnChanges(changes: SimpleChanges): any {
        if ('tablesrc' in changes) {
            if (changes.tablesrc.previousValue !== changes.tablesrc.currentValue) {
                console.log(`tablesrc change detected : ${changes.tablesrc.currentValue}`);
            }
            console.log(changes);
        }
    }
}