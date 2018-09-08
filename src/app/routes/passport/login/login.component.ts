import {MenuService, SettingsService} from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import {LvService} from "../../lvl/service/lv.service";
export const Roles = [
    {value: '1', label: '商户'},
    {value: '2', label: '资金'},
    {value: '3', label: '平台'}
];

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.less' ],
    providers: [ SocialService, LvService ]
})
export class UserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;
    pingtai1 = [
        {
        text: '分销管理',
        i18n: '分销管理',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
            text: '分销管理',
            i18n: '分销管理',
            icon: 'icon-speedometer',
            children: [{
                text: '分销合同申请',
                link: '/lvl/fxs/fxsq',
                i18n: '分销合同申请'
            }, {
                text: '分销合同确定',
                link: '/lvl/gys/htlb',
                i18n: '分销合同确定'
            }, {
                text: '分销合同列表',
                link: '/lvl/fxs/fxht',
                i18n: '分销合同列表'
            }]
        }]
    }, {
        text: '融资管理',
        i18n: '融资管理',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '预付融资',
                i18n: '预付融资',
                icon: 'icon-speedometer',
                children: [{
                    text: '融资申请',
                    link: '/lvl/rz/yfsq',
                    i18n: '融资申请'
                }, {
                    text: '融资合同',
                    link: '/lvl/rz/yfht',
                    i18n: '融资合同'
                }, {
                    text: '还款管理',
                    link: '/lvl/rz/yfhk',
                    i18n: '还款管理'
                }]
            },
            {
                text: '应收融资',
                i18n: '应收融资',
                icon: 'icon-speedometer',
                children: [{
                    text: '融资申请',
                    link: '/lvl/ys/rzsq',
                    i18n: '融资申请'
                }, {
                    text: '融资合同',
                    link: '/lvl/ys/rzht',
                    i18n: '融资合同'
                }, {
                    text: '还款管理',
                    link: '/lvl/ys/hklb',
                    i18n: '还款管理'
                }]
            }
        ]
    }, {
        text: '我的钱包',
        i18n: '我的钱包',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '钱包信息',
                i18n: '钱包信息',
                icon: 'icon-speedometer',
                link: '/lvl/wallet'
            }]
    },  {
        text: '信息管理',
        i18n: '信息管理',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '公司信息',
                i18n: '公司信息',
                icon: 'icon-speedometer',
                children: [{
                    text: '公司认证',
                    link: '/lvl/company/renz',
                    i18n: '公司认证'
                },
                    {
                        text: '公司信息',
                        link: '/lvl/company/basic',
                        i18n: '公司信息'
                    }]
            }]
    }];
    options = Roles;

    pingtai1_xm = [
        {
        text: '放贷业务',
        i18n: '放贷业务',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '预付融资',
                i18n: '预付融资',
                icon: 'icon-speedometer',
                children: [{
                    text: '贷款一览',
                    link: '/lvl/fang/yf/rzyl',
                    i18n: '贷款一览'
                }, {
                    text: '还款管理',
                    link: '/lvl/fang/yf/hkgl',
                    i18n: '还款管理'
                }]
            }, {
                text: '应收融资',
                i18n: '应收融资',
                icon: 'icon-rocket',
                children: [
                    {
                        text: '贷款一览',
                        link: '/lvl/fang/ys/rzyl',
                        i18n: '贷款一览'
                    }, {
                        text: '还款管理',
                        link: '/lvl/fang/ys/hkgl',
                        i18n: '还款管理'
                    }]
            }]
    }, {
        text: '我的钱包',
        i18n: '我的钱包',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '通证钱包',
                i18n: '通证钱包',
                icon: 'icon-speedometer',
                link: '/lvl/tz-wallet'
            }]
    },  {
        text: '资料信息',
        i18n: '资料信息',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '公司信息',
                i18n: '公司信息',
                icon: 'icon-speedometer',
                children: [
                    {
                    text: '公司认证',
                    link: '/lvl/company/renz',
                    i18n: '公司认证'
                   },
                    {
                        text: '公司信息',
                        link: '/lvl/company/basic',
                        i18n: '公司信息'
                    }]
            }]
    }];

    pingtai1_zs = [
        {
        text: '旅链平台',
        i18n: '旅链平台',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '规则设置',
                i18n: '规则设置',
                icon: 'icon-speedometer',
                link: '/lvl/qk/rule'
            },
            {
                text: '分销合同列表',
                i18n: '分销合同列表',
                icon: 'icon-speedometer',
                link: '/lvl/qk/fxht'
            },
            {
                text: '预付融资列表',
                i18n: '预付融资列表',
                icon: 'icon-speedometer',
                link: '/lvl/qk/yfrz'
            },
            {
                text: '应收融资列表',
                i18n: '应收融资列表',
                icon: 'icon-speedometer',
                link: '/lvl/qk/ysrz'
            }
            ]
    }, {
        text: '我的钱包',
        i18n: '我的钱包',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '通证钱包',
                i18n: '通证钱包',
                icon: 'icon-speedometer',
                link: '/lvl/qk/wallet'
            }]
    },  {
        text: '资料信息',
        i18n: '资料信息',
        group: true,
        hideInBreadcrumb: false,
        children: [
            {
                text: '公司信息',
                i18n: '公司信息',
                icon: 'icon-speedometer',
                children: [{
                    text: '公司认证',
                    link: '/lvl/company/renz',
                    i18n: '公司认证'
                },
                    {
                        text: '公司信息',
                        link: '/lvl/company/basic',
                        i18n: '公司信息'
                    }]
            }]
    }];

    menu1 = '';
    menu2 = '';
    menu3 = '';
    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService, private menuService: MenuService,
        private lvService: LvService) {
        this.form = fb.group({
            userType: [null],
            userName: [null, [Validators.required, Validators.minLength(3)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
        modalSrv.closeAll();
        this.menu1 = JSON.stringify(this.pingtai1);
        this.menu2 = JSON.stringify(this.pingtai1_xm);
        this.menu3 = JSON.stringify(this.pingtai1_zs);
    }

    // region: fields
    // get userType() { return this.form.controls.userType; }
    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            // this.userType.markAsDirty();
            // this.userType.updateValueAndValidity();
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;

        this.lvService.loginIn({userID: this.userName.value, passwd: this.password.value}).subscribe(res => {
            this.loading = false;
            if ( res.errcode === 0) {
                // 清空路由复用信息
                this.reuseTabService.clear();
                this.tokenService.set({
                    token: res.token,
                    uscc: res.uscc,
                    comName: res.name,
                    name: this.userName.value,
                    email: `lvl@gmail.com`,
                    id: 10000,
                    type: res.role || '1',
                    time: +new Date
                });
                if (res.role === '2') {
                    this.menuService.add(this.pingtai1_xm);
                    localStorage.setItem('lvMenu1', this.menu2);
                } else if (res.role === '3') {
                    this.menuService.add(this.pingtai1_zs);
                    localStorage.setItem('lvMenu2', this.menu3);
                } else {
                    this.menuService.add(this.pingtai1);
                    localStorage.setItem('lvMenu', this.menu1);
                }

                this.router.navigate(['/']);
            } else {
                this.error = `账户或密码错误`;
            }
        });
    }

    // region: social

    open(type: string, openType: SocialOpenType = 'href') {
        let url = ``;
        let callback = ``;
        if (environment.production)
            callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
        else
            callback = 'http://localhost:4200/callback/' + type;
        switch (type) {
            case 'auth0':
                url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'github':
                url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
            case 'weibo':
                url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
                break;
        }
        if (openType === 'window') {
            this.socialService.login(url, '/', {
                type: 'window'
            }).subscribe(res => {
                if (res) {
                    this.settingsService.setUser(res);

                    this.router.navigateByUrl('/');
                }
            });
        } else {
            this.socialService.login(url, '/', {
                type: 'href'
            });
        }
    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
