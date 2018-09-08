import {Component, OnInit} from '@angular/core';
import { SimpleTableColumn } from '@delon/abc';
import {TokenService} from "@delon/auth";
import {ActivatedRoute, Router} from "@angular/router";
import {LvService} from "../service/lv.service";
import {tap} from "rxjs/operators";
import {NzMessageService} from "ng-zorro-antd";
export enum DdFangStatus {
    'req' = "申请中" ,
    'ensure' = "通过审核",
    'btg' = "未通过审核" ,
    'clbz' = "未通过审核" ,
    'loaned' = "已TOKEN授信"
}
@Component({
  selector: 'app-yf-dkyl',
  templateUrl: './yf-dkyl.component.html',
})
export class YfDkylComponent implements OnInit {

    dstatus = DdFangStatus;
    data: any[] = [];
    loading = false;
    currentStatus = 'all';
    // @ViewChild('st') st: SimpleTableComponent;
    columns: SimpleTableColumn[] = [
        { title: '融资项目', index: 'title' },
        { title: '融资金额', index: 'loan' },
        { title: '提交申请', index: 'booktime', type: 'date', sorter: (a: any, b: any) => a.booktime - b.booktime
        },
        { title: '融资期限', index: 'term', type: 'number', format: (item: any) => `${item.term} 天` },
        { title: '年化利率', index: 'loanproduct.rate', format: (item: any) => `${item.loanproduct.rate}%` },
        { title: '订单状态', index: 'status', format: (item: any) => `${this.dstatus[item.status]}`},
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
        this.lvService.getFdRzyl({uscc: uscc, status: this.currentStatus, page: '1'})
            .pipe(tap(() => this.loading = false))
            .subscribe(res => {
                if (res.errcode === 0 && Array.isArray(res.msg)) {
                    this.data = res.msg;
                } else  {
                    const err = res.msg.toString() || '网络错误！';
                    this.msg.error(err);
                }
            });
    }
    getSelect(status) {
        this.currentStatus = status;
        this.getData();
    }
    checkDetail(item) {
        if (item.status === 'ensure') {
            this.router.navigate(['/lvl/fang/yf/token'], {
                queryParams: {
                    pfcsn: item.pfcsn
                }
            });
        } else {
            this.router.navigate(['/lvl/fang/yf/detail'], {
                queryParams: {
                    pfcsn: item.pfcsn,
                    txid: item.txid,
                    height: item.height,
                    timestamp: item.timestamp,
                    status: item.status
                }
            });
        }

    }

}
