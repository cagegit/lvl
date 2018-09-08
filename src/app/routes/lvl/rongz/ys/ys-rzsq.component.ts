import { Component, OnInit } from '@angular/core';
import { SimpleTableColumn } from '@delon/abc';
import {TokenService} from "@delon/auth";
import {uuid} from "../../fxsq/step1.component";
import {HOST_URL, LvService} from "../../service/lv.service";
import {tap} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-ys-rzsq',
  templateUrl: './ys-rzsq.component.html',
  styles: [`
      :host [nz-form] {
          margin: 20px auto 0;
          max-width: 500px;
      }
  `]
})
export class YsRzsqComponent implements OnInit {

    data: any[] = [];
    loading  = false;

    card_url = '';
    contract_url = '';
    current_step = 1;
    currentPsn = '';
    projects = [];
    hkfs = [
        {name: '一次性还本付息', val: '1'},
        {name: '按月付息，到期还本', val: '2'},
        {name: '等额本息，分期还款', val: '3'}
    ];
    form: FormGroup;
    columns: SimpleTableColumn[] = [
        { title: '贷款产品', index: 'name' },
        { title: '贷款期限', index: 'term' },
        { title: '年化率', index: 'rate', format: (item) => `${item.rate} %` },
        { title: '还款方式', index: 'repaymethod' },
        { title: '放款时间', index: 'conditions' },
        { title: '申请条件', index: 'lendtime', type: 'date' },
        { title: '操作',
            buttons: [
                { text: '确认', click: (item: any) => { this.toCreateForm(item); } }
            ]
        }
    ];
    uuid = '';
    fileInfo = {
        postFileUrl: HOST_URL + 'api/v1/attachfiles/create',
        postFileData: undefined,
        resData1: [],
        resData2: [],
        resData3: []
    };
    constructor(private lvService: LvService, private fb: FormBuilder, private activatedRoute: ActivatedRoute,
                private location: Location, private router: Router, private tokenService: TokenService, private _msg: NzMessageService) { }

    toCreateForm(item) {
        this.currentPsn = item.lpsn;
        this.router.navigate(['/lvl/ys/rzsq'], { queryParams: {
                psn: this.currentPsn,
                ran: new Date().getTime()
            }});
    }

    getData() {
        if (this.loading) return;
        this.loading = true;
        this.lvService.getRzList()
            .pipe(
                tap(() => { this.loading = false; })
            )
            .subscribe(res => {
                if (res.errcode === 0) {
                    this.data = res.LoanProduct;
                }
            });

    }
    _submitForm() {
        const exParam = {
            rfcsn: this.uuid,
            status: 'req',
            lpsn: this.currentPsn,
            borrower: this.tokenService.get().uscc,
            attachfiles: JSON.stringify(this.fileInfo.resData1.concat(this.fileInfo.resData2, this.fileInfo.resData3))
        };
        const params = Object.assign(exParam, this.form.value);
        if (this.form.value['fpsn']) {
            params.fpsn = this.form.value['fpsn'].dcsn;
        }
        if (this.form.value['repaymethod']) {
            params.repaymethod = this.form.value['repaymethod'].val;
        }
        const bpm = {
            bsn: params.pfcsn,
            active: 'active',
            type: 'fifu.com/rfc',
            title: params.title,
            operater: this.tokenService.get().name,
            status: 'req',
            memo: 'req'
        };
        this.loading = true;
        this.lvService.saveYsRzsq(params, bpm)
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe(res => {
                if (res) {
                    this._msg.success('保存成功');
                    setTimeout(() => {
                        this.router.navigate(['/lvl/sign'], {
                            queryParams: {
                                url: '/lvl/ys/rzht'
                            }
                        });
                    }, 500);
                } else {
                    this._msg.error('保存失败');
                }
            });
    }
    ngOnInit() {
        this.uuid = uuid();
        this.fileInfo.postFileData = {attachfiletype: 'receivable', attachfileuuid: this.uuid};
        // 获取融资项目列表
        this.lvService.getYsRzList({
            uscc: this.tokenService.get().uscc,
            status: "ensure",
            page: "1"
        }).subscribe(res => {
            if (res.errcode === 0 && res.msg && Array.isArray(res.msg)) {
                this.projects = res.msg;
            }
        });
        this.activatedRoute.queryParams.subscribe(queryParams => {
            if (queryParams && queryParams.psn) {
                this.current_step = 2;
                this.currentPsn = queryParams.psn;
            }
        });
        this.form = this.fb.group({
            title: [null, [Validators.required]],
            borrowername: [null, [Validators.required]],
            agent: [null, [Validators.required]],
            idcard: [null, [Validators.required]],
            fpsn: [null, [Validators.required]],
            total: [null, [Validators.required]],
            loan: [null, [Validators.required]],
            term: [null, [Validators.required]],
            term_dw: ['day'],
            repaymethod: [this.hkfs[0], [Validators.required]]
        });
        this.getData();
    }

    get title() {return this.form.controls['title']; }
    get borrowername() {return this.form.controls['borrowername']; }
    get agent() {return this.form.controls['agent']; }
    get idcard() {return this.form.controls['idcard']; }
    get fpsn() {return this.form.controls['fpsn']; }
    get total() {return this.form.controls['total']; }
    get loan() {return this.form.controls['loan']; }
    get term() {return this.form.controls['term']; }
    get term_dw() {return this.form.controls['term_dw']; }
    get repaymethod() {return this.form.controls['repaymethod']; }

    stepBack() {
        this.current_step = 1;
        this.location.replaceState('/lvl/ys/rzsq');
    }
    handleChange1({ file }): void {
        const status = file.status;
        if (status !== 'uploading') {
            if (file && file.response) {
                this.fileInfo.resData1.push(file.response);
            }
        }
    }
    handleChange2({ file }): void {
        const status = file.status;
        if (status !== 'uploading') {
            if (file && file.response) {
                this.fileInfo.resData2.push(file.response);
            }
        }
    }
    handleChange3({ file }): void {
        const status = file.status;
        if (status !== 'uploading') {
            if (file && file.response) {
                this.fileInfo.resData3.push(file.response);
            }
        }
    }
}
