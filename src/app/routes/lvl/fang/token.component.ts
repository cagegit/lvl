import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {DdFangStatus} from "./yf-dkyl.component";
import {LvService} from "../service/lv.service";
import {FileInfo, YfDetail} from "../rongz/yf/yf-detail.component";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {tap} from "rxjs/operators";
declare const jsSHA: any;
@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
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
export class TokenComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<{}>;
    @ViewChild('modalFooter') modalFooter: TemplateRef<{}>;
    dstatus = DdFangStatus;
    htInfo: any = <any>{};
    files: Array<FileInfo> = [];
    queryParam: any;
    loading = false;
    sx = {
        borrowerUsccHash: '',
        funderUsccHash: '',
        money: ''
    };
    modelF: NzModalRef;
    pfcsn = '';
    constructor(
        private lvService: LvService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private msg: NzMessageService,
        private modalSrv: NzModalService,
        private router: Router
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            console.log(queryParams);
            if (queryParams && queryParams.pfcsn) {
                this.pfcsn = queryParams.pfcsn;
                this.queryParam = queryParams;
                this.lvService.getTokenInfo(queryParams.pfcsn).subscribe(res => {
                    if (res.errcode === 0 && res.msg) {
                        this.htInfo = res.msg;
                        // 资金方的uscc
                        const funderUscc = res.msg.funder;
                        const funderUsccSHA256 = new jsSHA("SHA-256", "TEXT");
                        funderUsccSHA256.update(funderUscc);
                        this.sx.funderUsccHash = funderUsccSHA256.getHash("HEX");
                        // 对方账户的(分销商)uscc
                        const borrowerUscc = res.msg.borrower;
                        const borrowerUsccSHA256 = new jsSHA("SHA-256", "TEXT");
                        borrowerUsccSHA256.update(borrowerUscc);
                        this.sx.borrowerUsccHash = borrowerUsccSHA256.getHash("HEX");
                        if (res.files) {
                            this.files = res.files || [];
                        }
                    }
                });
            } else {
                this.location.back();
            }
        });
    }

    tokenZf() {
        this.sx.money = '';
        this.modelF = this.modalSrv.create({
            nzTitle: 'TOKEN转账',
            nzContent: this.modalContent,
            nzFooter: this.modalFooter
        });
    }
    /*
    * 确认转账
    * */
    congfirmZf() {
       if (!this.sx.money) {
           this.msg.error('授信金额不能为空！');
           return;
       }
       const pfcsn = this.pfcsn;
       const parms = {
           symbol: 'ticket',
           from: this.sx.funderUsccHash,
           to: this.sx.borrowerUsccHash,
           amount: this.sx.money,
           contract: "sc20180006",
           ttype: 'loan',
           bsn: pfcsn,
           memo: pfcsn
       };
       this.loading = true;
       this.lvService.tokenZz(pfcsn, parms)
               .pipe(
                   tap(() => this.loading = false)
               )
               .subscribe(res => {
              if (res && Array.isArray(res)) {
                  this.msg.success('转账成功！');
                  this.modelF.close();
                  setTimeout(() => {
                      this.router.navigate(['/lvl/fang/yf/rzyl'], {
                          queryParams: {
                              stmp: new Date().getTime()
                          }
                      });
                  }, 500);
              } else {
                  this.msg.error('转账失败！');
              }
       });
    }
}
