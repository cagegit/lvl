import { Component, OnInit } from '@angular/core';
import {SimpleTableColumn} from "@delon/abc";
import {LvService} from "../service/lv.service";
import {ActivatedRoute} from "@angular/router";
import {DdStatus} from "../fxht/fxht.component";
import {tap} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-qk-yfrz-ht',
  templateUrl: './qk-yfrz-ht.component.html',
})
export class QkYfrzHtComponent implements OnInit {

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
        { title: '融资项目', index: 'title' },
        { title: '融资金额', index: 'loan' },
        { title: '提交申请', index: 'booktime', type: 'date' },
        { title: '融资期限', index: 'term' },
        { title: '年化利率', index: 'loanproduct.rate', format: (item) => `${item.loanproduct.rate}%` },
        { title: '订单状态', index: 'status' }
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
        this.lvService.getYfrzData(this.currentStatus)
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
