import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema } from 'nz-schema-form';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn, SimpleTableComponent } from '@delon/abc';
import {TokenService} from "@delon/auth";
import {Router} from "@angular/router";
import {LvService} from "../../service/lv.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-ys-rzht',
  templateUrl: './ys-rzht.component.html',
})
export class YsRzhtComponent implements OnInit {

    loading = false;
    currentFilter = 'all';
    data = [];

    columns: SimpleTableColumn[] = [
        { title: '融资项目', index: 'title' },
        { title: '融资金额', index: 'loan' },
        { title: '提交申请', index: 'booktime', type: 'date' },
        { title: '融资期限', index: 'term' },
        { title: '年化利率', index: 'loanproduct.rate', format: (item) => `${item.loanproduct ? item.loanproduct.rate : 0 }%` },
        { title: '订单状态', index: 'status' },
        { title: '区块详情',
            buttons: [
                { text: '查看详情', format: (item: any) => `...${item.txid.slice(-8)}`, click: (item: any) => { this.checkDetail(item); } }
            ] }
    ];

    constructor(private lvService: LvService, private tokenService: TokenService, private router: Router) { }

    ngOnInit() {
        this.getData();
    }

    getSelect(item: string) {
        this.currentFilter = item;
        this.getData();
    }
    getData() {
        this.loading = true;
        const param = {
            uscc: this.tokenService.get().uscc,
            status: this.currentFilter,
            page: '1'
        };
        this.lvService.getYshtList(param)
            .pipe(
                tap(() => {this.loading = false; })
            )
            .subscribe(res => {
                if (res.errcode === 0 && res.msg ) {
                    this.data = res.msg;
                }
            });
    }

    checkDetail(item) {
        this.router.navigate(['/lvl/ys/ys-detail'], {
            queryParams: {
                dcsn: item.rfcsn,
                status: item.status,
                txid: item.txid,
                height: item.height,
                timestamp: item.timestamp
            }});
    }
}
