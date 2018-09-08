import { Component, OnInit} from '@angular/core';
import {TokenService} from "@delon/auth";
import {LvService} from "../service/lv.service";
import {CompanyInfo} from "./basic-info.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {uuid} from "../fxsq/step1.component";

@Component({
  selector: 'app-renz',
  templateUrl: './renz.component.html',
})
export class RenzComponent implements OnInit {

    card_url = '';
    loading = false;
    comInfo: CompanyInfo = <CompanyInfo>{};
    form: FormGroup;
    fileInfo = {
        postFileUrl: '',
        postFileData: undefined,
        resData: []
    };
    uuid = '';
    constructor(private lvService: LvService, private tokenService: TokenService, private fb: FormBuilder, private msg: NzMessageService) { }

    ngOnInit() {
        this.uuid = uuid();
        this.fileInfo.postFileData = {attachfiletype: 'company', attachfileuuid: this.uuid};
        this.form = this.fb.group({
            name: [null, [Validators.required]],
            legalpersion: [null, [Validators.required]],
            IDCard: [null, [Validators.required]],
            uscc: [null, [Validators.required]],
            account: [null, [Validators.required]],
            address: [null, [Validators.required]],
            tel: [null, [Validators.required]]
        });
        const token = this.tokenService.get().token;
        this.lvService.getUserInfo(token).subscribe(res => {
            if (res && res.errcode === 0) {
                // this.comInfo  = res.company || {};
                this.form.patchValue(res.company);
            }
        });
    }

    get name() {return this.form.controls['name']; }
    get legalpersion() {return this.form.controls['legalpersion']; }
    get IDCard() {return this.form.controls['IDCard']; }
    get uscc() {return this.form.controls['uscc']; }
    get account() {return this.form.controls['account']; }
    get address() {return this.form.controls['address']; }
    get tel() {return this.form.controls['tel']; }

    _submitForm() {
        const param = Object.assign({token: this.tokenService.get().token, type: 'com', attachfiles: JSON.stringify(this.fileInfo.resData)}, this.form.value);
        this.lvService.addCompany(param).subscribe(res => {
            // console.log(res);
            if (res.errcode === 0) {
                this.msg.success('保存成功');
            } else {
                this.msg.error('保存失败');
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
