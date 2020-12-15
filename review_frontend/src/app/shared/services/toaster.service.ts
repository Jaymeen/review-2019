import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    public summary_value;
    public detail_value;
    public severity_value;
    public key_value;

    constructor(private messageService: MessageService) { }
    showSuccess(summary_value, detail_value) {
        this.messageService.add({ severity: 'success', summary: summary_value, detail: detail_value });
    }

    showInfo(summary_value, detail_value) {
        this.messageService.add({ severity: 'info', summary: summary_value, detail: detail_value });
    }

    showWarn(summary_value, detail_value) {
        this.messageService.add({ severity: 'warn', summary: summary_value, detail: detail_value });
    }

    showError(summary_value, detail_value) {
        this.messageService.add({ severity: 'error', summary: summary_value, detail: detail_value });
    }

    showCustom(summary_value, detail_value) {
        this.messageService.add({ key: 'custom', severity: 'info', summary: summary_value, detail: detail_value });
    }

    showTopLeft(summary_value, detail_value) {
        this.messageService.add({ key: 'tl', severity: 'info', summary: summary_value, detail: detail_value });
    }

    showTopCenter(summary_value, detail_value) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: summary_value, detail: detail_value });
    }

    showMultiple(summary_value, detail_value) {
        this.messageService.addAll([
            { severity: 'info', summary: summary_value, detail: detail_value },
            { severity: 'info', summary: summary_value, detail: detail_value },
            { severity: 'info', summary: summary_value, detail: detail_value }
        ]);
    }

    clear() {
        this.messageService.clear();
    }

}
