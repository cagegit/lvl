import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import {LvService} from "../../lvl/service/lv.service";
import {_HttpClient} from "@delon/theme";
import {tap} from "rxjs/operators";
import {Roles} from "../login/login.component";

@Component({
    selector: 'passport-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.less' ],
    providers: [LvService]
})
export class UserRegisterComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;
    visible = false;
    status = 'pool';
    progress = 0;
    passwordProgressMap = {
        ok: 'success',
        pass: 'normal',
        pool: 'exception'
    };
    // 阅读协议是否选中
    isXyCk = false;
    options = Roles;

    constructor(fb: FormBuilder, private router: Router, public msg: NzMessageService, private lvService: LvService) {
        this.form = fb.group({
            userType: [null, [Validators.required]],
            company: [null, [Validators.required]],
            name: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/)]],
            nickName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/)]],
            password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
            confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]]
        });
    }

    static checkPassword(control: FormControl) {
        if (!control) return null;
        const self: any = this;
        self.visible = !!control.value;
        if (control.value && control.value.length > 9)
            self.status = 'ok';
        else if (control.value && control.value.length > 5)
            self.status = 'pass';
        else
            self.status = 'pool';

        if (self.visible) self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }

    static passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }

    // region: fields
    get company() { return this.form.controls.company; }
    get nickName() { return this.form.controls.nickName; }
    get password() { return this.form.controls.password; }
    get confirm() { return this.form.controls.confirm; }
    get name() { return this.form.controls.name; }
    get userType() { return this.form.controls.userType; }

    count = 0;
    interval$: any;

    // endregion

    submit() {
        this.error = '';
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.loading = true;
        const param = {
            org: this.form.value['company'],
            name: this.form.value['name'],
            userID: this.form.value['nickName'],
            passwd: this.form.value['password'],
            roleID: this.form.value['userType'],
            email: 'ministor@126.com'
        };
        this.lvService.createUserInfo(param)
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe(res => {
            if (res.errcode === 0) {
                this.msg.success('恭喜！用户注册成功！请登录');
                setTimeout(() => {
                    this.router.navigate(['/passport/login']);
                }, 1000);
            } else {
                this.msg.error('抱歉！用户注册失败！');
            }
        });
    }
    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
