import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransferService } from './transfer.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {
    form: FormGroup;
    loading = false;

    constructor(private fb: FormBuilder, public item: TransferService, private router: Router) {}

    ngOnInit() {
        this.form = this.fb.group({
            password: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
        });
        this.form.patchValue(this.item);
    }

    //#region get form fields
    get password() { return this.form.controls.password; }
    //#endregion

    _submitForm() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/lvl/fxs/fxht'], {
                queryParams: {
                    stmp: new Date().getTime()
                }
            });
        }, 1000);
    }

    prev() {
        --this.item.step;
    }
}
