import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { SimpleTableColumn } from '@delon/abc';
import {TokenService} from "@delon/auth";
import {Observable} from "rxjs/Observable";
import {LvService} from "../../service/lv.service";
import {tap} from "rxjs/operators";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
declare var jsSHA: any;

@Component({
  selector: 'app-ys-hklb',
  templateUrl: './ys-hklb.component.html',
    styles: [`
    .hk-head {
        background-color: #337AB7;
        border-radius: 50px;
        border: rgb(100,100,100) 1px;
        width: 100px;
        height: 100px;
        padding-top: 15px;
        margin: 0 auto;
    }
    .hk-head > img {
        width: 60px;
        height: 60px;
    }
  `]
})
export class YsHklbComponent implements OnInit {

    @ViewChild('modalContent') modalContent: TemplateRef<{}>;
    @ViewChild('modalFooter') modalFooter: TemplateRef<{}>;
    loading = false;
    currentFilter = 'all';
    data = [];
    columns: SimpleTableColumn[] = [
        { title: '融资项目', index: 'fpname' },
        { title: '融资金额', index: 'loan' },
        { title: '提交申请', index: 'UpdatedAt', type: 'date' },
        { title: '融资期限', index: 'term' },
        { title: '年化利率', index: 'rate', format: (item) => `${ item.rate }%` },
        { title: '订单状态', index: 'status' }
    ];
    columns1: SimpleTableColumn[] = [
        { title: '融资项目', index: 'fpname' },
        { title: '融资金额', index: 'loan' },
        { title: '提交申请', index: 'UpdatedAt', type: 'date' },
        { title: '融资期限', index: 'term' },
        { title: '年化利率', index: 'rate', format: (item) => `${ item.rate }%` },
        { title: '订单状态', index: 'status' },
        { title: '操作',
            buttons: [
                { text: '立即转账', click: (item: any) => { this.zhuanZhang(item); } }
            ] }
    ];
    // 转账
    item = {
        qbye: 0,
        yhje: 0,
        hkje: '',
        rpsn: ''
    };
    funderHash = '';
    borrowerHash = '';
    fundername = '';

    modelF: NzModalRef;
    constructor(private lvService: LvService, private tokenService: TokenService, private modalSrv: NzModalService
        , private msg: NzMessageService) { }

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
            rptype: 'receivable'
        };
        this.lvService.getRepayList(param)
            .pipe(
                tap(() => {this.loading = false; })
            )
            .subscribe(res => {
                if (res.errcode === 0 && res.msg ) {
                    this.data = res.msg;
                }
            });
    }

    zhuanZhang(item) {
        const uscc = this.tokenService.get().uscc;
        const usccSHA256 = new jsSHA("SHA-256", "TEXT");
        usccSHA256.update(uscc);
        const uscchash = usccSHA256.getHash("HEX");
        this.lvService.getRepayBalance(uscchash).subscribe(res => {
            if (!res.Frozen && res.BalanceOf) {
                this.item.qbye = +res.BalanceOf;
            }
        });
        this.item.rpsn = item.rpsn;
        this.lvService.getRepayInfo(item.rpsn).subscribe(res => {
            if (res.errcode === 0 && res.msg) {
                const loan = res.msg["loan"]; // 应还金额
                const funder = res.msg["funder"]; // 融资方的uscc
                const borrower = res.msg["borrower"]; // 借方的uscc
                this.fundername = res.msg["fundername"]; // 融资方账户名称
                const repayamount = res.msg["repayamount"]; // 应还
                const alreadyamount = res.msg["alreadyamount"]; // 已还

                const funderSHA256 = new jsSHA("SHA-256", "TEXT");
                funderSHA256.update(funder);
                this.funderHash = funderSHA256.getHash("HEX");

                const borrowerSHA256 = new jsSHA("SHA-256", "TEXT");
                borrowerSHA256.update(borrower);
                this.borrowerHash = borrowerSHA256.getHash("HEX");
                this.item.yhje = repayamount - alreadyamount;
                this.item.hkje = '';
                this.modelF = this.modalSrv.create({
                    nzTitle: '立即还款',
                    nzContent: this.modalContent,
                    nzFooter: this.modalFooter
                });
            }
        });

    }

    congfirmZf() {
        if (!this.item.hkje) {
            this.msg.error('请输入还款金额');
            return;
        }
        if (this.loading) return;
        this.loading = true;
        const post1 = this.lvService.updateList(this.item.rpsn, this.item.hkje + '');
        const bpm = {
            symbol: "ticket",
            from: this.borrowerHash,
            to: this.funderHash,
            amount: this.item.hkje,
            ttype: "transfer",
            bsn: this.item.rpsn
        };
        const post2 = this.lvService.transferAsset(bpm);
        Observable.forkJoin([post1, post2]).pipe(
            tap(() => this.loading = false)
        ).subscribe(res => {
            if (res) {
                this.msg.success('转账成功');
                this.modelF.close();
                this.item.hkje = '';
            }   else {
                this.msg.error('转账失败');
            }
        });
    }
}
