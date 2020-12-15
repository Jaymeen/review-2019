import {Component, Injectable} from '@angular/core';
import {SelectItem} from 'primeng/components/common/api';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

@Injectable({
    providedIn: 'root'
})
export class MessageServiceDemo {

    message: Message[] = [];
    public summary_value;
    public detail_value;
    public severity_value;
    public key_value;

    constructor(private messageService: MessageService) {}

    showSuccess(summary_value, detail_value) {
        this.message = [];
        this.message.push({ severity: 'success', summary: summary_value, detail: detail_value });
    }

    showInfo(summary_value, detail_value) {
        this.message = [];
        this.message.push({ severity: 'info', summary: summary_value, detail: detail_value });
    }

    showWarn(summary_value, detail_value) {
        this.message = [];
        this.message.push({ severity: 'warn', summary: summary_value, detail: detail_value });
    }

    showError(summary_value, detail_value) {
        this.message = [];
        this.message.push({ severity: 'error', summary: summary_value, detail: detail_value });
    }

    showMultiple(summary_value, detail_value) {
        this.message = [];
        this.message.push({ severity: 'success', summary: summary_value, detail: detail_value });
        this.message.push({ severity: 'success', summary: summary_value, detail: detail_value });
        this.message.push({ severity: 'success', summary: summary_value, detail: detail_value });
    }
    
    showViaService(summary_value, detail_value) {
        this.message.push({ severity: 'success', summary: summary_value, detail: detail_value });
    }

    clear() {
        this.message = [];
    }
}