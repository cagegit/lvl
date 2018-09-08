import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
})
export class SignComponent implements OnInit {

    loading = false;
    targetUrl = '';
    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe( p => {
              if (p && p.url) {
                  this.targetUrl = p.url;
              }
        });
    }

    _submitForm() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.router.navigate([this.targetUrl], {
                queryParams: {
                    stmp: new Date().getTime()
                }
            });
        }, 1000);
    }

}
