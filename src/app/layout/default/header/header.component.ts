import {Component, Inject} from '@angular/core';
import { SettingsService } from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    searchToggleStatus: boolean;
    userType = '';
    constructor(public settings: SettingsService, @Inject(DA_SERVICE_TOKEN) private tokenSer: TokenService) {
        if (tokenSer.get().type === '2') {
             this.userType = '资金端';
        } else if (tokenSer.get().type === '3') {
            this.userType = '平台端';
        } else {
            this.userType = '商户端';
        }
    }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    searchToggleChange() {
        this.searchToggleStatus = !this.searchToggleStatus;
    }

}
