import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';

@Component({
  selector: 'app-qk-rule',
  templateUrl: './qk-rule.component.html',
})
export class QkRuleComponent implements OnInit {

    yjcd: any = 'A';
    jfms: any = 'A';
    bfb: any;
    cplv_sx: any;
    dbrz_sz: any;
    constructor(private http: _HttpClient) { }

    ngOnInit() { }

}
