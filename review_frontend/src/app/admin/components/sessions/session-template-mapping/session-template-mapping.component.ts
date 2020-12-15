import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../../services/sessions.service';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { constant } from 'src/app/app.const';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';

interface Rows {
  value: number;
}

@Component({
  selector: 'app-session-template-mapping',
  templateUrl: './session-template-mapping.component.html',
  styleUrls: ['./session-template-mapping.component.scss']
})
export class SessionTemplateMappingComponent implements OnInit {

  rows: Rows[];
  cols: any[];
  mapData: any[];

  sessionId: number;
  sessionStatus: number;
  sessionName: string;
  errorMessage: string;

  order: any = -1;
  sortAttribute: string = "template_name";
  length: number;
  page: boolean;
  rowPerPage: number = constant.PAGESIZE;
  pageIndex = constant.STARTINGINDEX;
  mappingListForm: FormGroup;

  constructor(
    private sessionService: SessionsService,
    private fb: FormBuilder,
    private toast: ToasterService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.rows = constant.ROWS;
    this.rowPerPage = constant.PAGESIZE;
  }

  ngOnInit() {
    this.cols = [
      { field: 'template_name', header: 'Template' },
      { field: 'reviewer_name', header: 'Primary Reviewer' },
      { field: 'secondaryreviewer_name', header: 'Secondary Reviewers' },
      { field: 'reviewees', header: 'Reviewees' }
    ];

    this.mappingListForm = this.fb.group({
      recordsPerPage: [
        { 'value': '5' }
      ]
    });

    this.onDropDownValueChange();
    this.getSessionData();
  }

  getSessionData() {
    this.sessionId = this.activatedRoute.snapshot.params.sessionId;
    this.getSessionMappingData(this.sessionId, this.rowPerPage, this.pageIndex, this.sortAttribute,
      this.order);
  }

  onDropDownValueChange() {
    this.mappingListForm.get('recordsPerPage').valueChanges.subscribe(val => {
      this.rowPerPage = val.value;
      this.page = Math.ceil(this.length / this.rowPerPage) > 1;
      this.getSessionMappingData(this.sessionId, this.rowPerPage, this.pageIndex, this.sortAttribute,
        this.order);
    });
  }

  ngOnChanges() {
    this.getSessionMappingData(this.sessionId, this.rowPerPage, this.pageIndex, this.sortAttribute,
      this.order);
  }

  paginate(event) {
    this.getSessionMappingData(this.sessionId, this.rowPerPage, event.page + 1, this.sortAttribute,
      this.order);
  }

  customSort(event: LazyLoadEvent) {
    this.order = event.sortOrder ? event.sortOrder : this.order;
    this.sortAttribute = event.sortField ? event.sortField : this.sortAttribute;
    this.getSessionMappingData(this.sessionId, this.rowPerPage, this.pageIndex, this.sortAttribute,
      this.order);
  }
  getSessionMappingData(sessionId, pageSize, pageIndex, sortAttribute,
    order) {
    this.sessionService.loadMappingData(sessionId, pageSize, pageIndex, sortAttribute,
      order).subscribe(

        data => {
          this.mapData = data[0];
          this.length = data[1];
          this.sessionName = data[2].sessionName;
          this.sessionStatus = data[2].sessionStatus;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          if (error.error.code === 'JOIFALSE') {
            this.errorMessage = 'Session ID must be a number !';
          }
          else if (error.error.code === 'SIDNOTFOUND') {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = 'Invalid data !'
          }
          this.length = 0;
          this.toast.showError('Error', this.errorMessage);
          this.route.navigate(['/list-sessions']);
        });
  }

  revieweeCSV(reviewees) {
    if (reviewees.length == 1 && reviewees[0] == "") {
      return "";
    }
    let revieweeNames = '';
    for (const reviewee of reviewees) {
      revieweeNames = revieweeNames + ', ' + reviewee;
    }
    revieweeNames = revieweeNames.substr(1);
    return revieweeNames;
  }

  tooltipText(revieweeNames) {
    if (revieweeNames.length > 50) {
      revieweeNames = revieweeNames.substr(0, 100);
      return revieweeNames.concat(' ...');
    } else {
      return revieweeNames;
    }
  }

  onBack() {
    this.route.navigate(['list-sessions']);
  }

  mapSessionData() {
    this.route.navigate(['session-mapping', this.sessionId]);
  }
}
