import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FileInfo, YfDetail} from "../rongz/yf/yf-detail.component";
import {LvService} from "../service/lv.service";
import {tap} from "rxjs/operators";
import {Location} from "@angular/common";
import {DdFangStatus} from "./yf-dkyl.component";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {Zhengx} from "./yf-xq.component";

@Component({
  selector: 'app-ys-xq',
  templateUrl: './ys-xq.component.html',
})
export class YsXqComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<{}>;
    @ViewChild('modalFooter') modalFooter: TemplateRef<{}>;
    dstatus = DdFangStatus;
    htInfo: any = <any>{};
    files: Array<FileInfo> = [];
    queryParam: any;
    loading = false;
    shList = [
        {label: '通过申请', val: 'ensure'},
        {label: '不通过', val: 'btg'},
        {label: '材料不足，需要补充材料', val: 'clbz'},
    ];
    shParam = {
        result: this.shList[0],
        yqfk: ''
    };
    item = {
        url: '',
        file: '近3个月流水.xls'
    };
    zhengx: Zhengx;
    modelF: NzModalRef;
    isLoaned = false;
    constructor(
        private lvService: LvService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private msg: NzMessageService,
        private router: Router,
        private modalSrv: NzModalService
    ) { }
    // 审核合同信息
    shenhe() {
        const bsn = this.queryParam.pfcsn || '';
        const status = this.shParam.result ? this.shParam.result['val'] : '';
        console.log(this.shParam.yqfk);
        if (!status) {
            this.msg.error('请输入审核结果');
           return;
        }
        if (!this.shParam.yqfk) {
            this.msg.error('请输入预期放款');
            return;
        }
        const bpmParam = {
            bsn: bsn,
            active: "signed",
            type: "tickechain.com/ffc",
            title: "合同",
            operater: "",
            meme: this.shParam.yqfk
        };
        this.loading = true;
        this.lvService.sheheYsFang(bsn, status, bpmParam)
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe(res => {
                if (res && Array.isArray(res)) {
                    this.msg.success('审核成功');
                    setTimeout(() => {
                        this.router.navigate(['/lvl/fang/ys/rzyl'], {
                            queryParams: {
                                stmp: new Date().getTime()
                            }
                        });
                    }, 1000);
                } else {
                    this.msg.error('审核失败');
                }
            });
    }
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (queryParams && queryParams.pfcsn) {
                this.queryParam = queryParams;
                this.isLoaned = queryParams.status === 'loaned';
                this.lvService.getZfysRzxq(queryParams.pfcsn).subscribe(res => {
                    if (res ) {
                        this.htInfo = res;
                        if (res.files) {
                            this.files = res.files || [];
                        }
                        if (res.borrower) {
                            this.lvService.getCompoanyInfo(res.borrower).subscribe(res1 => {
                                if (res1.errcode === 0 && res1.company) {
                                    this.zhengx = res1.company;
                                    if (res1.company.files && res1.company.files.length > 0) {
                                        this.zhengx.files = res1.company.files;
                                    } else {
                                        this.zhengx.files = [
                                            {url: './assets/img/qyxy.jpg', file: '企业信用证明'},
                                            {url: './assets/img/liushui.jpg', file: '近三个月银行流水'},
                                            {url: './assets/img/nashui.jpg', file: '纳税证明'}
                                        ];
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                this.location.back();
            }
        });
    }
    /*
    * 企业征信
    * */
    qyzx() {
        this.modelF = this.modalSrv.create({
            nzTitle: '公司征信信息',
            nzWidth: 680,
            nzContent: this.modalContent,
            nzFooter: this.modalFooter
        });
    }
}
