import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransferService } from './transfer.service';
import {HOST_URL, LvService} from "../service/lv.service";
import {TokenService} from "@delon/auth";
import {Observable} from "rxjs/Observable";
import {NzMessageService} from "ng-zorro-antd";

export function uuid() {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    const uid = s.join("");

    return ("dcsn" + uid).replace(/-/g, "");
}

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {
    form: FormGroup;
    dscn = '';
    fileInfo = {
        postFileData: undefined,
        postFileUrl: HOST_URL + 'api/v1/attachfiles/create',
        resData: []
    };

    constructor(private fb: FormBuilder, public item: TransferService, private lvService: LvService,
                private tokenService: TokenService, private _msg: NzMessageService) {}

    ngOnInit() {
        // this.item.uploadUrl = HOST_URL + 'api/v1/distributorcontract/create';
        this.form = this.fb.group({
            fx_gyx: [null, [Validators.required]],
            fx_htxm: [null, [Validators.required]],
            fx_percent: [null, [Validators.required]],
            fx_amount: [null, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])]
        });
        this.form.patchValue(this.item);
        this.lvService.getGysList().subscribe(res => {
             if (res.errcode === 0) {
                 this.item.gysList = res.companies;
                 this.item.fx_gyx = this.item.gysList[0];
             }
        });
        this.dscn = uuid();
        this.fileInfo.postFileData = {attachfiletype: 'distributor', attachfileuuid: this.dscn};
    }

    //#region get form fields
    get fx_gyx() { return this.form.controls['fx_gyx']; }
    get fx_htxm() { return this.form.controls['fx_htxm']; }
    get fx_amount() { return this.form.controls['fx_amount']; }
    get fx_percent() { return this.form.controls['fx_percent']; }
    //#endregion

    _submitForm() {
        if (this.fileInfo.resData.length === 0) {
            this._msg.error('请选择上传的文件');
            return;
        }
        this.item = Object.assign(this.item, this.form.value);
        const formPra = {
            dcsn: this.dscn,
            distributor: this.tokenService.get().uscc,
            distributorname: this.tokenService.get().comName,
            active: 'active',
            tyep: 'fifu.com/contract',
            status: 'req',
            suppliername: this.form.value['fx_gyx'].name,
            supplier: this.form.value['fx_gyx'].uscc,
            title: this.form.value['fx_htxm'],
            amount: this.form.value['fx_amount'],
            PrepayRate: this.form.value['fx_percent'].val,
            attachfiles: JSON.stringify(this.fileInfo.resData)
        };
        const post1 = this.lvService.fenXiaoReq(formPra);
        const params = {
            bsn: this.dscn,
            active: "active",
            type: "fifu.com/dc",
            title: this.form.value['fx_htxm'],
            operater: this.tokenService.get().name,
            status: 'req',
            memo: 'req'
        };
        const post2 = this.lvService.bpmCreate(params);
        Observable.forkJoin([post1, post2]).subscribe(res => {
             if (res && Array.isArray(res)) {
                 console.log(res);
                 this._msg.success('合同信息已保存！');
                 ++this.item.step;
             } else {
                 this._msg.error('合同信息保存失败！');
             }
        });
    }

    handleChange({ file }): void {
        const status = file.status;
        if (status !== 'uploading') {
            if (file && file.response) {
                this.fileInfo.resData.push(file.response);
            }
        }
    }
}
