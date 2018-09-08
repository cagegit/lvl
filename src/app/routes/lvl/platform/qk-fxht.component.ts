import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SimpleTableColumn} from "@delon/abc";
import {TokenService} from "@delon/auth";
import {tap} from "rxjs/operators";
import {LvService} from "../service/lv.service";
import {DdStatus} from "../fxht/fxht.component";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-qk-fxht',
  templateUrl: './qk-fxht.component.html',
})
export class QkFxhtComponent implements OnInit {

    dstatus = DdStatus;
    data: any[] = [];
    loading = false;
    status = [
        { index: 'req', text: this.dstatus['req'], value: false, type: 'default', checked: false },
        { index: 1, text: this.dstatus['yqd'], value: false, type: 'processing', checked: false },
        { index: 2, text: this.dstatus['ydz'], value: false, type: 'success', checked: false },
        { index: 3, text: this.dstatus['yqr'], value: false, type: 'error', checked: false },
        { index: 4, text: this.dstatus['ygb'], value: false, type: 'error', checked: false }
    ];
    currentStatus = 'all';
    columns: SimpleTableColumn[] = [
        { title: '合作项目', index: 'title' },
        { title: '供应商', index: 'suppliername' },
        { title: '提交时间', index: 'booktime', type: 'date',
            sorter: (a: any, b: any) => a.booktime - b.booktime
        },
        { title: '订单金额', index: 'amount', type: 'number', format: (item: any) => `¥ ${item.amount}` },
        { title: '预付金额', index: 'PrepayRate', type: 'number', format: (item: any) => `¥ ${item.amount * item.PrepayRate / 100}` },
        { title: '订单状态', index: 'status', render: 'status'
        }
    ];
    constructor(
        private lvService: LvService,
        public msg: NzMessageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getData();
    }
    getData() {
        this.loading = true;
        this.lvService.getFxhtData(this.currentStatus)
            .pipe(tap(() => this.loading = false))
            .subscribe(res => {
                if (res.errcode === 0 && Array.isArray(res.msg)) {
                    this.data = res.msg;
                } else  {
                    const err = res.msg || '网络错误！';
                    this.msg.error(err);
                }
            });
    }
    getSelect(status) {
        this.currentStatus = status;
        this.getData();
        this.route.queryParams.subscribe(p => {
            if (p && p.stmp) {
                this.getData();
            }
        });
    }

}
