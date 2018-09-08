import { Component, OnInit } from '@angular/core';
import {StepService} from "./step.service";

@Component({
  selector: 'app-yscl',
  templateUrl: './yscl.component.html',
    styles: [`
        :host {
            display: block;
        }
        :host ::ng-deep .ant-steps {
            max-width: 750px;
            margin: 16px auto;
        }
        :host ::ng-deep .step-box {
            margin: 40px auto 0;
            max-width: 500px;
        }
    `],
   providers: [StepService]
})
export class YsclComponent implements OnInit {

    constructor(public item: StepService) { }

    ngOnInit() {
    }

}
