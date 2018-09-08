import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs/observable/zip';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';
import {Location} from "@angular/common";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private injector: Injector,
        private location: Location,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
    }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
               // this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`),
                this.httpClient.get('assets/app-data.json')
            ).pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([appData]) => {
                    resolve(null);
                    return [appData];
                })
            ).subscribe(([appData]) => {
                // setting language data
               // this.translate.setTranslation(this.i18n.defaultLang, langData);
                // this.translate.setDefaultLang('zh-CN');
                // application data
                const res: any = appData;
                // 应用信息：包括站点名、描述、年份
                this.settingService.setApp(res.app);
                // 用户信息：包括姓名、头像、邮箱地址
                this.settingService.setUser(res.user);
                // ACL：设置权限为全量
                this.aclService.setFull(true);
                // 初始化菜单
                 const sos = this.tokenService.get();
                 if (!sos.name) {
                     this.location.go('/passport/login');
                 }
                 if (sos.type === '2') {
                     if (localStorage.getItem('lvMenu1')) {
                         this.menuService.add(JSON.parse(localStorage.getItem('lvMenu1')));
                     }
                 } else if (sos.type === '3') {
                     if (localStorage.getItem('lvMenu2')) {
                         this.menuService.add(JSON.parse(localStorage.getItem('lvMenu2')));
                     }
                 } else {
                     if (localStorage.getItem('lvMenu')) {
                         this.menuService.add(JSON.parse(localStorage.getItem('lvMenu')));
                     }
                 }


                // 设置页面标题的后缀
                this.titleService.suffix = res.app.name;
            },
            () => { },
            () => {
                resolve(null);
            });
        });
    }
}