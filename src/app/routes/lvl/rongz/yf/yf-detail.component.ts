import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LvService} from "../../service/lv.service";
import {DdStatus} from "../../fxht/fxht.component";
import {Location} from "@angular/common";

export interface YfDetail {
    "pfcsn": string;
    "title":  string;
    "borrower": string;
    "borrowername": string;
    "agent": string;
    "idcard": string;
    "idcardfile": object;
    "funder": string;
    "fundername": string;
    "lpsn":  string;
    "loanproduct": {rate: string, name: string};
    "fpsn":  string;
    "project": {name: string};
    "total": number;
    "loan": number;
    "term":  string;
    "repaymethod":  string;
    "booktime":  string;
    "starttime":  string;
    "endtime":  string;
    "status":  string;
    "BorrowerSigned":  string;
    "FunderSigned":  string;
    "memo": string;
    }
export interface QkInfo {
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
export interface FileInfo {
    desc: string;
    file: string;
    hash: string;
    name: string;
    path: string;
    url: string;
    uuid: string;
}
@Component({
  selector: 'app-yf-detail',
  templateUrl: './yf-detail.component.html',
})
export class YfDetailComponent implements OnInit {

    dstatus = DdStatus;
    htInfo: YfDetail = <YfDetail>{};
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
        private location: Location
    ) { }
    // 确认合同流程
    // confirmContract() {
    //     if (this.queryParam) {
    //         this.loading  = true;
    //         const param = {
    //             bsn: this.queryParam.dcsn,
    //             active: "ensure",
    //             type: "fifu.com/dc",
    //             title: "确定合同",
    //             operater: this.tokenService.get().name,
    //             status: "ensure",
    //             memo: "ensure"
    //         };
    //         const post1 = this.lvService.bpmUpdate(param);
    //         const post2 = this.lvService.updateConStatus( {dcsn: this.queryParam.dcsn, status: 'ensure'});
    //         Observable.forkJoin([post1, post2]).pipe(tap(() => this.loading = false)).subscribe(res => {
    //             console.log(res);
    //             this.parentInfo.status = 'ensure';
    //             setTimeout(() => {
    //                 this.router.navigate(['/lvl/fxs/htlb']);
    //             }, 1000);
    //         });
    //     }
    // }
    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            // let productId = queryParams.productId;
            // console.log(queryParams);
            if (queryParams && queryParams.dcsn) {
                this.queryParam = queryParams;
                this.parentInfo.status = queryParams.status || 'req';
                // this.parentInfo.type = +queryParams.type;
                this.lvService.yfrzDetail(queryParams.dcsn).subscribe(res => {
                    if (res && Array.isArray(res)) {
                        if (res[0]) {
                            this.htInfo = res[0];
                            if (res[0].files) {
                                this.files = res[0].files || [];
                            }
                        }
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
