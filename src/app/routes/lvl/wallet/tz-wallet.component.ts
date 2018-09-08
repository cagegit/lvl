import { Component, OnInit } from '@angular/core';
import { SimpleTableColumn } from '@delon/abc';
import {TokenService} from "@delon/auth";
import {Observable} from "rxjs/Observable";
import {LvService} from "../service/lv.service";
import {tap} from "rxjs/operators";
declare const jsSHA: any;
enum PayType {
    'loan' = '贷款',
    'transfer' = '转入'
}
@Component({
  selector: 'app-tz-wallet',
  templateUrl: './tz-wallet.component.html',
})
export class TzWalletComponent implements OnInit {

    payType = PayType;
    data = [];
    loading = false;
    totalYe = 0;
    funderHash = '';
    columns: SimpleTableColumn[] = [
        { title: '交易类型', index: 'ttype', format: (item) => `${this.payType[item.ttype]}` },
        { title: 'FROM', index: 'from', format: (item) => `...${item.from.slice(-6)}`  },
        { title: 'TO', index: 'to', format: (item) => `...${item.to.slice(-6)}`  },
        { title: '金额', index: 'amount', format: (item) => `${item.amount} 元` },
        { title: '交易时间', index: 'timestamp', type: 'date' },
        { title: '操作', buttons: [
                { text: '查看详情', click: (item: any) => { } }
            ] }
    ];

    constructor(private lvService: LvService, private tokenService: TokenService) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        const uscc = this.tokenService.get().uscc;
        const usccSHA256 = new jsSHA("SHA-256", "TEXT");
        usccSHA256.update(uscc);
        const uscchash = usccSHA256.getHash("HEX");
        this.funderHash  = uscchash;
        const post1 = this.lvService.getPayList(uscchash);
        const post2 = this.lvService.getRepayBalance(uscchash);
        Observable.forkJoin([post1, post2])
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe(res => {
                if (res && Array.isArray(res)) {
                    if (res[0] && res[0].errcode === 0 && res[0].msg) {
                        this.data = res[0].msg;
                    }
                    if (res[1]) {
                        this.totalYe = +res[1].BalanceOf || 0;
                    }
                }
            });
    }
}
