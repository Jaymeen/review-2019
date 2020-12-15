import { Component, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-template-preview',
    templateUrl: './template-preview.component.html',
    styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
    public templateId;
    public canCall = false;
    form: FormGroup;
    public origin: string;
    public backPath: string;

    constructor(private route: Router,
        private activatedRoute: ActivatedRoute,
        private _location: Location) {

    }

    ngOnInit() {
        this.templateId = this.activatedRoute.snapshot.paramMap.get('templateId');
        this.origin = this.activatedRoute.snapshot.queryParamMap.get('origin');
        if (!this.templateId) {
            this.route.navigate(['list-templates']);
        }
        else {
            this.canCall = true;
        }

        if (this.origin === 'create') {
            this.backPath = `editTemplate/${this.templateId}`;
        }
        else { this.backPath = 'list-templates'; }


    }
    closetab() {
        this.route.navigate([this.backPath]);
    }
    @Output() onSubmit($event) {

    }
}
