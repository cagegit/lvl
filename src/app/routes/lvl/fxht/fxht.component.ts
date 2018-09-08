import {Component, OnInit} from '@angular/core';
import {SimpleTableColumn} from '@delon/abc';
import {NzMessageService} from "ng-zorro-antd";
import {ActivatedRoute, Router} from "@angular/router";
import {LvService} from "../service/lv.service";
import {TokenService} from "@delon/auth";
import { tap } from 'rxjs/operators';

export enum DdStatus {
    'req' = "申请中" ,
    'yqd' = "已预订",
    'ydz' = "预定中" ,
    'ensure' = "已确认",
    'ygb' = "已关闭",
}

@Component({
  selector: 'app-fxht',
  templateUrl: './fxht.component.html',
})
export class FxhtComponent implements OnInit {
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
    // @ViewChild('st') st: SimpleTableComponent;
    columns: SimpleTableColumn[] = [
        { title: '合作项目', index: 'title' },
        { title: '供应商', index: 'suppliername' },
        { title: '提交时间', index: 'booktime', type: 'date',
            sorter: (a: any, b: any) => a.booktime - b.booktime
        },
        { title: '订单金额', index: 'amount', type: 'number', format: (item: any) => `¥ ${item.amount}` },
        { title: '预付金额', index: 'PrepayRate', type: 'number', format: (item: any) => `¥ ${item.amount * item.PrepayRate / 100}` },
        { title: '订单状态', index: 'status', render: 'status'
        },
        {
            title: '区块详情',
            buttons: [
                { text: '查看详情', format: (item: any) => `...${item.txid.slice(-8)}`, click: (item: any) => { this.checkDetail(item); } }
            ]
        }
    ];
    constructor(
        private lvService: LvService,
        private tokenService: TokenService,
        public msg: NzMessageService,
        public router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getData();
        this.route.queryParams.subscribe(p => {
            if (p && p.stmp) {
                this.getData();
            }
        });
    }
    getData() {
        this.loading = true;
        const uscc = this.tokenService.get().uscc; // 2374633583
        this.lvService.fenXiaoYiLan({uscc: uscc, status: this.currentStatus, page: '1'})
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
    }
    checkDetail(item) {
        this.router.navigate(['/lvl/fxs/ht-detail'], {
            queryParams: {
                type: 0, // 0 申请 1 确认
                status: item.status,
                dcsn: item.dcsn
            }
        });
    }
}
