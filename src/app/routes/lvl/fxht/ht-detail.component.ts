import { Component, OnInit } from '@angular/core';
import {LvService} from "../service/lv.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {DdStatus} from "./fxht.component";
import {TokenService} from "@delon/auth";
import {Observable} from "rxjs/Observable";
import {tap} from "rxjs/operators";

interface HtDetail {
    DistributorSigned: string;
    PrepayRate: number;
    SupplierSigned: string;
    amount: number;
    booktime: string;
    dcsn: string;
    distributor: string;
    distributorname: string;
    endtime: string;
    files: Array<any>;
    memo: string;
    pfcsn: string;
    prepaidstatus: string;
    receivablestatus: string;
    rfcsn: string;
    starttime: string;
    status: string;
    supplier: string;
    suppliername: string;
    title: string;
}
interface QkInfo {
    CreatedAt: string;
    DeletedAt: string;
    ID: number;
    UpdatedAt: string;
    active: string;
    bsn: string;
    desc: string;
    height: number;
    ischeck: boolean;
    memo: string;
    operater: string;
    operatetime: string;
    status: string;
    timestamp: string;
    title: string;
    txid: string;
    type: string;
}
interface FileInfo {
    desc: "合同文件 : 众信-航旅分销合同01";
    file: "众信分销合同.doc";
    hash: "e3bb998d5e16c1af6e666032c8988915";
    name: "合同文件";
    path: "/home/ubuntu/docker-v/fileserver/html/ticketchain/distributor/";
    url: "http://123.206.29.15:5000/ticketchain/distributor/众信分销合同.doc";
    uuid: "dcsn43bc640b7baf48d98cd741438f784611";
}
@Component({
  selector: 'app-ht-detail',
  templateUrl: './ht-detail.component.html',
})
export class HtDetailComponent implements OnInit {
    dstatus = DdStatus;
    htInfo: HtDetail = <HtDetail>{};
    qkInfo: Array<QkInfo> = [];
    files: Array<FileInfo> = [];
    process = 0;
    parentInfo = {
        status: 'req',
        type: 0
    };
    queryParam;
    loading = false;
    constructor(
        private lvService: LvService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private tokenService: TokenService,
        private router: Router
    ) { }
    // 确认合同流程
    confirmContract() {
        if (this.queryParam) {
            this.loading  = true;
            const param = {
                bsn: this.queryParam.dcsn,
                active: "ensure",
                type: "fifu.com/dc",
                title: "确定合同",
                operater: this.tokenService.get().name,
                status: "ensure",
                memo: "ensure"
            };
            const post1 = this.lvService.bpmUpdate(param);
            const post2 = this.lvService.updateConStatus( {dcsn: this.queryParam.dcsn, status: 'ensure'});
            Observable.forkJoin([post1, post2]).pipe(tap(() => this.loading = false)).subscribe(res => {
                this.parentInfo.status = 'ensure';
                setTimeout(() => {
                    this.router.navigate(['/lvl/sign'], {
                        queryParams: {
                            url: '/lvl/gys/htlb'
                        }
                    });
                }, 1000);
            });
        }
    }
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            // let productId = queryParams.productId;
            // console.log(queryParams);
            if (queryParams && queryParams.dcsn) {
                this.queryParam = queryParams;
                this.parentInfo.status = queryParams.status || 'req';
                this.parentInfo.type = +queryParams.type;
                // console.log(this.parentInfo);
                this.lvService.fenXiaoDetail(queryParams.dcsn).subscribe(res => {
                    if (res && Array.isArray(res)) {
                        if (res[0]) {
                            this.htInfo = res[0];
                            this.files = res[0].files || [];
                        }
                        // this.qkInfo = res[1];
                        if (res[1] && res[1].errcode === 0 && Array.isArray(res[1].msg)) {
                            if (res[1].msg.length > 1) {
                                this.process = 1 ;
                            } else {
                                this.process = 0 ;
                            }
                            this.qkInfo = res[1].msg;
                        }
                    }
                });
            } else {
                this.location.back();
            }
        });
    }

}
