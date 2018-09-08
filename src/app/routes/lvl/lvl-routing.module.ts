import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FxsqComponent} from './fxsq/fxsq.component';
import {FxhtComponent} from './fxht/fxht.component';
import {HtDetailComponent} from "./fxht/ht-detail.component";
import {YsclComponent} from "./yscl/yscl.component";
import {GyhtComponent} from "./fxht/gyht.component";
import {RzsqComponent} from "./rongz/yf/rzsq.component";
import {RzhtComponent} from "./rongz/yf/rzht.component";
import {HklbComponent} from "./rongz/yf/hklb.component";
import {YfDetailComponent} from "./rongz/yf/yf-detail.component";
import {YsRzsqComponent} from "./rongz/ys/ys-rzsq.component";
import {YsRzhtComponent} from "./rongz/ys/ys-rzht.component";
import {YsHklbComponent} from "./rongz/ys/ys-hklb.component";
import {YsDetailComponent} from "./rongz/ys/ys-detail.component";
import {MyWalletComponent} from "./wallet/my-wallet.component";
import {BasicInfoComponent} from "./company/basic-info.component";
import {RenzComponent} from "./company/renz.component";
import {YfDkylComponent} from "./fang/yf-dkyl.component";
import {YfHkglComponent} from "./fang/yf-hkgl.component";
import {YfXqComponent} from "./fang/yf-xq.component";
import {YsDkylComponent} from "./fang/ys-dkyl.component";
import {YsHkglComponent} from "./fang/ys-hkgl.component";
import {YsXqComponent} from "./fang/ys-xq.component";
import {TzWalletComponent} from "./wallet/tz-wallet.component";
import {QkWalletComponent} from "./platform/qk-wallet.component";
import {QkRuleComponent} from "./platform/qk-rule.component";
import {TokenComponent} from "./fang/token.component";
import {YsTokenComponent} from "./fang/ys-token.component";
import {QkFxhtComponent} from "./platform/qk-fxht.component";
import {QkYfrzHtComponent} from "./platform/qk-yfrz-ht.component";
import {QkYsrzHtComponent} from "./platform/qk-ysrz-ht.component";
import {SignComponent} from "./sign/sign.component";

const routes: Routes = [
    {
        path: 'fxs',
        children: [
            {path: 'fxsq', component: FxsqComponent},
            {path: 'fxht', component: FxhtComponent},
            {path: 'ht-detail', component: HtDetailComponent, data: { title: '分销合同详情', titleI18n: '分销合同详情' }}
        ]
    },
    {
        path: 'gys',
        children: [
            {path: 'yscl', component: YsclComponent},
            {path: 'htlb', component: GyhtComponent}
        ]
    },
    {
        path: 'rz',
        children: [
            {path: 'yfsq', component: RzsqComponent},
            {path: 'yfht', component: RzhtComponent},
            {path: 'yfhk', component: HklbComponent},
            {path: 'yf-detail', component: YfDetailComponent, data: { title: '预付融资详情', titleI18n: '预付融资详情' }}
        ]
    },
    {
        path: 'ys',
        children: [
            {path: 'rzsq', component: YsRzsqComponent},
            {path: 'rzht', component: YsRzhtComponent},
            {path: 'hklb', component: YsHklbComponent},
            {path: 'ys-detail', component: YsDetailComponent, data: { title: '应收融资详情', titleI18n: '应收融资详情' }}
        ]
    },
    {
        path: 'wallet',
        component: MyWalletComponent
    },
    {
        path: 'company',
        children: [
            {path: 'basic', component: BasicInfoComponent},
            {path: 'renz', component: RenzComponent},
        ]
    },
    {
        path: 'fang',
        children: [
            {path: 'yf/rzyl', component: YfDkylComponent},
            {path: 'yf/hkgl', component: YfHkglComponent},
            {path: 'yf/detail', component: YfXqComponent, data: { title: '预付融资详情', titleI18n: '预付融资详情' }},
            {path: 'ys/rzyl', component: YsDkylComponent},
            {path: 'ys/hkgl', component: YsHkglComponent},
            {path: 'ys/detail', component: YsXqComponent, data: { title: '应收融资详情', titleI18n: '应收融资详情' }},
            {path: 'yf/token', component: TokenComponent, data: { title: '预付TOKEN', titleI18n: '预付TOKEN' }},
            {path: 'ys/token', component: YsTokenComponent, data: { title: '应收TOKEN', titleI18n: '应收TOKEN' }}
        ]
    },
    {
        path: 'tz-wallet',
        component: TzWalletComponent
    },
    {
        path: 'qk',
        children: [
            {path: 'rule', component: QkRuleComponent},
            {path: 'wallet', component: QkWalletComponent},
            {path: 'fxht', component: QkFxhtComponent},
            {path: 'yfrz', component: QkYfrzHtComponent},
            {path: 'ysrz', component: QkYsrzHtComponent}
        ]
    },
    {
        path: 'sign',
        component: SignComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LvlRoutingModule { }
