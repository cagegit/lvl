import { NgModule } from '@angular/core';
import { LvlRoutingModule } from './lvl-routing.module';
import { FxsqComponent } from './fxsq/fxsq.component';
import { FxhtComponent } from './fxht/fxht.component';
import {SharedModule} from "@shared/shared.module";
import {LvService} from "./service/lv.service";
import {Step1Component} from "./fxsq/step1.component";
import {Step2Component} from "./fxsq/step2.component";
import {Step3Component} from "./fxsq/step3.component";
import { Step4Component } from './fxsq/step4.component';
import { HtDetailComponent } from './fxht/ht-detail.component';
import { YsclComponent } from './yscl/yscl.component';
import {TokenService} from "@delon/auth";
import { GyhtComponent } from './fxht/gyht.component';
import { RzsqComponent } from './rongz/yf/rzsq.component';
import { RzhtComponent } from './rongz/yf/rzht.component';
import { HklbComponent } from './rongz/yf/hklb.component';
import { YfDetailComponent } from './rongz/yf/yf-detail.component';
import { YsDetailComponent } from './rongz/ys/ys-detail.component';
import { YsHklbComponent } from './rongz/ys/ys-hklb.component';
import { YsRzhtComponent } from './rongz/ys/ys-rzht.component';
import { YsRzsqComponent } from './rongz/ys/ys-rzsq.component';
import { MyWalletComponent } from './wallet/my-wallet.component';
import { BasicInfoComponent } from './company/basic-info.component';
import { RenzComponent } from './company/renz.component';
import { YfDkylComponent } from './fang/yf-dkyl.component';
import { YfHkglComponent } from './fang/yf-hkgl.component';
import { YsDkylComponent } from './fang/ys-dkyl.component';
import { YsHkglComponent } from './fang/ys-hkgl.component';
import { YfXqComponent } from './fang/yf-xq.component';
import { YsXqComponent } from './fang/ys-xq.component';
import { TzWalletComponent } from './wallet/tz-wallet.component';
import { QkRuleComponent } from './platform/qk-rule.component';
import { QkWalletComponent } from './platform/qk-wallet.component';
import { TokenComponent } from './fang/token.component';
import { YsTokenComponent } from './fang/ys-token.component';
import { QkFxhtComponent } from './platform/qk-fxht.component';
import { QkYfrzHtComponent } from './platform/qk-yfrz-ht.component';
import { QkYsrzHtComponent } from './platform/qk-ysrz-ht.component';
import { SignComponent } from './sign/sign.component';

const COMPONENT_NOROUNT = [
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component
];

@NgModule({
  imports: [
    SharedModule,
    LvlRoutingModule
  ],
  providers: [
     LvService,
     TokenService
  ],
  declarations: [
      FxsqComponent,
      FxhtComponent,
      ...COMPONENT_NOROUNT,
      HtDetailComponent,
      YsclComponent,
      GyhtComponent,
      RzsqComponent,
      RzhtComponent,
      HklbComponent,
      YfDetailComponent,
      YsDetailComponent,
      YsHklbComponent,
      YsRzhtComponent,
      YsRzsqComponent,
      MyWalletComponent,
      BasicInfoComponent,
      RenzComponent,
      YfDkylComponent,
      YfHkglComponent,
      YsDkylComponent,
      YsHkglComponent,
      YfXqComponent,
      YsXqComponent,
      TzWalletComponent,
      QkRuleComponent,
      QkWalletComponent,
      TokenComponent,
      YsTokenComponent,
      QkFxhtComponent,
      QkYfrzHtComponent,
      QkYsrzHtComponent,
      SignComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class LvlModule { }
