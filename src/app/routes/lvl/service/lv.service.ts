import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {_HttpClient} from "@delon/theme";
import 'rxjs/add/observable/forkJoin';
import {HttpHeaders} from "@angular/common/http";
declare var jsSHA: any;

interface ResBack {
    "errcode": number;
    "token": string;
    "uscc": string;
    "name": string;
    "role"?: string;
}
interface ComRes {
    'errcode': number;
    'msg': any;
}

export const HOST_URL = 'http://123.206.29.15:8080/';

@Injectable()
export class LvService {

   private  HOST_URL = HOST_URL;

    constructor(private http: _HttpClient) {
    }

    /*
    * 创建用户
    * */
    createUserInfo(params: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/users/create';
        const params1 = new URLSearchParams();
        for (const key in params) {
            if (key) {
                params1.set(key, params[key]);
            }
        }
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post(url, params1.toString(), null, {headers: headers});
    }

    /*
    * 分销合同列表
    * */
    loginIn(params: { userID: string, passwd: string }): Observable<ResBack> {
        const url = this.HOST_URL + 'api/v1/login';
        const passwdSHA256 = new jsSHA("SHA-256", "TEXT");
        passwdSHA256.update(params.passwd);
        const hash = passwdSHA256.getHash("HEX");
        return this.http.post(url, {userID: params.userID, passwd: hash});
    }

    /*
    * 分销一览
    * */
    fenXiaoYiLan(params: { uscc: string, status: string | "all", page: string | "1" }): Observable<ComRes> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/list/distributor';
        return this.http.get(url, params);
    }

    /*
    * 分销申请
    * */
    fenXiaoReq(params: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/create';
        const params1 = new URLSearchParams();
        for (const key in params) {
            if (key) {
                params1.set(key, params[key]);
            }
        }
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post(url, params1.toString(), null, {headers: headers});
    }

    /*
    * 生成区块链记录
    * */
    bpmCreate(params: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/bpm/create';
        return this.http.post(url, params);
    }

    /*
    * 分销合同列表
    * */
    fenXiaoContract(params: { uscc: string, status: string | "all", page: string | "1" }): Observable<any> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/list/supplier';
        return this.http.get(url, params);
    }

    /*
    * 分销合同详情
    * */
    fenXiaoDetail(dcsn: string): Observable<any> {
        const url = this.HOST_URL + 'api/blockchain/v1/distributorcontract/info/' + dcsn;
        const detailInfo = this.http.get(url, {});
        const qk_url = this.HOST_URL + 'api/v1/bpm-block/list/' + dcsn;
        const qkInfo = this.http.get(qk_url, {});
        return Observable.forkJoin([detailInfo, qkInfo]);
        // return this.http.get(url, {});
    }

    /*
    * 更新合同区块链记录
    * */
    bpmUpdate(params: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/bpm/update';
        return this.http.post(url, params);
    }

    /*
    * 更新合同状态
    * */
    updateConStatus(params: { dcsn: string, status: string | "ensure" }): Observable<any> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/update/status';
        const body = `dcsn=${params.dcsn}&status=${params.status}`;
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post(url, body, null, {headers: headers});
    }

    /*
    * 获取供应商列表
    * */
    getGysList(): Observable<{ errcode: number, companies: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/company/list/com';
        return this.http.get(url, {});
    }

    //////////////////// 融资管理api

    /*
    * 获取融资建议
    * */
    getRzList(): Observable<{ errcode: number, LoanProduct: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/loanproduct/list';
        return this.http.get(url, {});
    }
    /*
    * 获取融资项目
    * */
    getRzProjects(params: object): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/list/distributor';
        return this.http.get(url, params);
    }

    /*
    * 保存预付申请
    * */
    saveYfsq(params: object, params2: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/PrepaidFinanceContracts/create';
        const params1 = new URLSearchParams();
        for (const key in params) {
            if (key) {
                params1.set(key, params[key]);
            }
        }
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        const post1 = this.http.post(url, params1.toString(), null, {headers: headers});
        const url2 = this.HOST_URL + 'api/v1/bpm/create';
        const post2 = this.http.post(url2, params2);
        return Observable.forkJoin([post1, post2]);
    }

    /*
    * 获取预付融资列表
    * */
    getYfrzList(params: {uscc: string, status: string, page: string}): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/PrepaidFinanceContracts/list/borrower';
        return this.http.get(url, params);
    }
    /*
    * 获取还款列表
    * */
    getRepayList(params: {uscc: string, status: string, rptype: string}): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/repayment/list/borrower';
        return this.http.get(url, params);
    }
    /*
    * 获取还款信息
    * */
    getRepayInfo(rpsn: string): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/repayment/info/' + rpsn ;
        return this.http.get(url, {});
    }

    // 获取钱包余额
    getRepayBalance(uscchash: string): Observable<{ Frozen: boolean, memo: string, BalanceOf: Array<any> }> {
        const url = this.HOST_URL + 'api/blockchain/v1/asset/balance/ticket/' + uscchash  ;
        return this.http.get(url, {});
    }
    /*
    * 更新列表
    * */
    updateList(rpsn: string, amount: string): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/repayment/update/' + rpsn  ;
        return this.http.post(url, {amount: amount});
    }
    /*
    * 转账
    * */
    transferAsset(params: object): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/asset/transfer';
        const params1 = new URLSearchParams();
        for (const key in params) {
            if (key) {
                params1.set(key, params[key]);
            }
        }
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post(url, params1.toString(), null, {headers: headers});
    }

    // api/v1/bpm-block/list
    /*
    * 预付融资详情
    * */
    yfrzDetail(pscsn: string ): Observable<Array<any>>  {
        const url1 = this.HOST_URL + 'api/blockchain/v1/prepaidcontract/info/' + pscsn;
        const post1 = this.http.get(url1, {});
        const url2 = this.HOST_URL + 'api/v1/bpm-block/list/' + pscsn;
        const post2 = this.http.get(url2, {});
        return Observable.forkJoin([post1, post2]);
    }

    //////////////////////////  获取融资

    /*
    * 获取应收融资列表
    * */
    getYsRzList(params: object): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/list/supplier';
        return this.http.get(url, params);
    }

    /*
   * 保存应收申请
   * */
    saveYsRzsq(params: object, params2: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/ReceivableFinanceContracts/create';
        const params1 = new URLSearchParams();
        for (const key in params) {
            if (key) {
                params1.set(key, params[key]);
            }
        }
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        const post1 = this.http.post(url, params1.toString(), null, {headers: headers});
        const url2 = this.HOST_URL + 'api/v1/bpm/create';
        const post2 = this.http.post(url2, params2);
        return Observable.forkJoin([post1, post2]);
    }

    /*
    * 获取应收融资列表
    * */
    getYshtList(params: {uscc: string, status: string, page: string}): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/ReceivableFinanceContracts/list/borrower';
        return this.http.get(url, params);
    }
    /*
   * 应收融资详情
   * */
    yfszDetail(rscsn: string ): Observable<Array<any>>  {
        const url1 = this.HOST_URL + 'api/blockchain/v1/receivablecontract/info/' + rscsn;
        const post1 = this.http.get(url1, {});
        const url2 = this.HOST_URL + 'api/v1/bpm-block/list/' + rscsn;
        const post2 = this.http.get(url2, {});
        return Observable.forkJoin([post1, post2]);
    }
    /*
    * 获取交易记录
    * */
    getPayList(uscchash: string): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/asset-block/list/' + uscchash;
        return this.http.get(url, {});
    }
    /*
    * 获取用户基本信息
    * */
    getUserInfo(token: string): Observable<{ errcode: number, company: any }> {
        const url = this.HOST_URL + 'api/v1/company/info?token=' + token;
        return this.http.get(url, {});
    }
    /*
    * 创建公司信息
    * */
    addCompany(params: object): Observable<{ errcode: number, company: any }> {
        const url = this.HOST_URL + 'api/v1/company/create';
        const params1 = new URLSearchParams();
        for (const key in params) {
            if (key) {
                params1.set(key, params[key]);
            }
        }
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post(url, params1.toString(), null, {headers: headers});
    }

    //// ///////////////////////////// 出资方
    /*
    * 获取预付融资一览
    * */
    getFdRzyl(params: object): Observable<{ errcode: number, msg: Array<object> | string }> {
        const url = this.HOST_URL + 'api/v1/PrepaidFinanceContracts/list/funder';
        return this.http.get(url, params);
    }
    /*
    * 获取预付一览详情
    * */
    getFdRzylDetail(pscsn: string): Observable<any> {
        const url = this.HOST_URL + 'api/blockchain/v1/prepaidcontract/info/' + pscsn;
        return this.http.get(url, {});
    }
    /*
    * 审核放贷申请
    * */
    sheheFang(pscsn: string, status: string, bpmParam: object): Observable<object> {
        const url = this.HOST_URL + 'api/v1/PrepaidFinanceContracts/update/' + pscsn + '/' + status;
        const post1 = this.http.post(url, {});
        const url2 = this.HOST_URL + 'api/v1/bpm/update';
        const post2 = this.http.post(url2, bpmParam);
        return Observable.forkJoin([post1, post2]);
    }
    /*
    * 获取资方预付融资
    * */
    getZfYfrz(params: {uscc: string, status: string, rptype: string}): Observable<{ errcode: number, msg: Array<any> }> {
        const url = this.HOST_URL + 'api/v1/repayment/list/funder';
        return this.http.get(url, params);
    }
    /*
    * 获取资方应收融资一览
    * */
    getZfysRzyl(params: object): Observable<{ errcode: number, msg: Array<object> | string }> {
        const url = this.HOST_URL + 'api/v1/ReceivableFinanceContracts/list/funder';
        return this.http.get(url, params);
    }
    /*
    * 获取资方应收融资详情
    * */
    getZfysRzxq(pscsn: string): Observable<any> {
        const url = this.HOST_URL + 'api/blockchain/v1/receivablecontract/info/' + pscsn;
        return this.http.get(url, {});
    }
    /*
    * 审核应收放贷申请
    * */
    sheheYsFang(pscsn: string, status: string, bpmParam: object): Observable<object> {
        const url = this.HOST_URL + 'api/v1/ReceivableFinanceContracts/update/' + pscsn + '/' + status;
        const post1 = this.http.post(url, {});
        const url2 = this.HOST_URL + 'api/v1/bpm/update';
        const post2 = this.http.post(url2, bpmParam);
        return Observable.forkJoin([post1, post2]);
    }

    /*
    * TOKEN info
    * */
    getTokenInfo(pscsn: string): Observable<any> {
        const url = this.HOST_URL + 'api/v1/PrepaidFinanceContracts/info/' + pscsn;
        return this.http.get(url, {});
    }
    /*
    * TOKEN 转账
    * */
    tokenZz(pscsn: string, tkParams: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/repayment/create/prepaid/' + pscsn ;
        const post1 = this.http.post(url, {});
        const post2 = this.saveAsstsLoan(tkParams);
        return Observable.forkJoin([post1, post2]);
    }

    /*
    * 获取应收 Token
    * */
    getYsToken(pscsn: string): Observable<any> {
        const url = this.HOST_URL + 'api/v1/ReceivableFinanceContracts/info/' + pscsn;
        return this.http.get(url, {});
    }
    /*
    * 应收Token 转账
    * */
    ysTokenZhang(pscsn: string, tkParams: object): Observable<any> {
        const url = this.HOST_URL + 'api/v1/repayment/create/receivable/' + pscsn ;
        const post1 = this.http.post(url, {});
        const post2 = this.saveAsstsLoan(tkParams);
        return Observable.forkJoin([post1, post2]);
    }

    /*
    * token 记录
    * */
    saveAsstsLoan(tkParams: object): Observable<any> {
        const params1 = new URLSearchParams();
        for (const key in tkParams) {
            if (key) {
                params1.set(key, tkParams[key]);
            }
        }
        const url2 = this.HOST_URL + 'api/v1/asset/loan';
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        return this.http.post(url2, params1.toString(), null, {headers: headers});
    }

    /*
    * 获取公司信息
    * */
    getCompoanyInfo(uscc: string): Observable<any> {
        const url = this.HOST_URL + 'api/v1/company/infobyuscc/' + uscc;
        return this.http.get(url, {});
    }

    /*
    * 获取所有分销合同列表
    * */
    getFxhtData(status: string | 'all'): Observable<any> {
        const url = this.HOST_URL + 'api/v1/distributorcontract/list/all?status=' + status + '&page=1';
        return this.http.get(url, {});
    }
    /*
   * 获取预付融资列表
   * */
    getYfrzData(status: string | 'all'): Observable<any> {
        const url = this.HOST_URL + 'api/v1/PrepaidFinanceContracts/list/all?status=' + status + '&page=1';
        return this.http.get(url, {});
    }
    /*
   * 获取应收融资列表
   * */
    getYsrzData(status: string | 'all'): Observable<any> {
        const url = this.HOST_URL + 'api/v1/ReceivableFinanceContracts/list/all?status=' + status + '&page=1';
        return this.http.get(url, {});
    }

}
