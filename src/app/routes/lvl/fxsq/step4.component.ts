import { Component, OnInit } from '@angular/core';
import {TransferService} from "./transfer.service";

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
})
export class Step4Component implements OnInit {

    constructor(public item: TransferService) { }

    ngOnInit() {
    }

}
