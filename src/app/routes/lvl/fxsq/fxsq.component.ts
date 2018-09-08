import { Component, OnInit } from '@angular/core';
import {TransferService} from "./transfer.service";

@Component({
  selector: 'app-fxsq',
  templateUrl: './fxsq.component.html',
  styleUrls: [ './fxsq.component.less' ],
  providers: [ TransferService ]
})
export class FxsqComponent implements OnInit {

    constructor(public item: TransferService) { }

    ngOnInit() {

    }
}
