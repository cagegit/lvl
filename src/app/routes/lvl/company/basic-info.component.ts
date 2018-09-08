import { Component, OnInit } from '@angular/core';
import {LvService} from "../service/lv.service";
import {TokenService} from "@delon/auth";

export interface CompanyInfo {
    CreatedAt: string;
    DeletedAt: string | null;
    ID: number;
    IDCard: string;
    UpdatedAt: string;
    account: string;
    address: string;
    files: Array<any>;
    legalpersion: string;
    name: string;
    tel: string;
    type: string;
    uscc: string;
    userID: string;
    verified: string;
}

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styles  : [`
      :host ::ng-deep .ant-carousel .slick-slide {
      text-align: center;
      height: 300px;
      line-height: 300px;
      background: #364d79;
      color: #fff;
      overflow: hidden;
    }
    h3 {
      color: #fff;
    }
    `]
})
export class BasicInfoComponent implements OnInit {
    array = [1];
    comInfo: CompanyInfo = <CompanyInfo>{};
    process = 60;
    constructor(private lvService: LvService, private tokenService: TokenService) { }

    ngOnInit() {
        const token = this.tokenService.get().token;
        this.lvService.getUserInfo(token).subscribe(res => {
            if (res && res.errcode === 0) {
                this.comInfo  = res.company || {};
            }
        });
        setTimeout(_ => {
            this.array = [ 1, 2, 3, 4 ];
        }, 500);
    }

}
