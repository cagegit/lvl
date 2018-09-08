import { Injectable } from '@angular/core';
import {HOST_URL} from "../service/lv.service";

@Injectable()
export class TransferService {

    HOST_URL = HOST_URL;
    step: 0 | 1 | 2 = 1;

    /**
     * 供应商
     */
    gysList: any[] = [];
    /**
     * 预付比例
     */
    yfblList: any[] = [];
    /**
     * 上传路径
     */
    uploadUrl: string;

    /**
     * 付款账户
     */
    pay_account: string;

    /**
     * 收款账户类型
     */
    receiver_type: 'alipay' | 'bank';

    get receiver_type_str() {
        return this.receiver_type === 'alipay' ? '支付宝' : '银行';
    }

    /**
     * 收款账户
     */
    receiver_account: string;

    /**
     * 收款姓名
     */
    receiver_name: string;

    /**
     * 金额
     */
    amount: number;

    /**
     * 支付密码
     */
    password = '123456';

    fx_gyx: string;
    fx_htxm: string;
    fx_percent: string;
    fx_amount: string;
    again() {
        this.step = 0;
        this.pay_account = 'ant-design@alipay.com';
        this.receiver_type = 'alipay';
        this.receiver_account = 'test@example.com';
        this.receiver_name = 'asdf';
        this.amount = 500;
        // this.gysList = [
        //     {name: '飞猪', uscc: '1'},
        //     {name: '途牛', uscc : '2'},
        //     {name: '神马', uscc : '3'},
        //     {name: '乾羊', uscc : '4'},
        //     ];
        this.yfblList = [
            {label: '20%', val: '20'},
            {label: '30%', val: '30'},
            {label: '50%', val: '50'},
            {label: '80%', val: '80'}
        ];
        // this.fx_gyx = this.gysList[0];
        this.fx_htxm = '小项目';
        // this.fx_percent = this.yfblList[2];
        this.fx_amount = '20';
        this.uploadUrl = this.HOST_URL + '/attachfiles/create';
    }

    constructor() {
        this.again();
    }
}
